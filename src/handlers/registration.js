import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import {
  BUTTON_IDS,
  COLORS,
  MODAL_IDS,
  INPUT_IDS,
  UNVERIFIED_ROLE_ID,
  SUPPORT_EMAIL,
} from '../config/constants.js';
import { validateContactInHubSpot } from '../services/hubspotValidator.js';
import { getRoles, clearRoles } from '../services/pendingRolesStore.js';

export async function handleInteraction(interaction) {
  if (interaction.isButton()) {
    await handleButtonInteraction(interaction);
  } else if (interaction.isModalSubmit()) {
    await handleModalSubmit(interaction);
  }
}

async function handleButtonInteraction(interaction) {
  const isAcceptTerms = interaction.customId === BUTTON_IDS.ACCEPT_TERMS;
  const isRetryValidation = interaction.customId === BUTTON_IDS.RETRY_VALIDATION;

  if (!isAcceptTerms && !isRetryValidation) {
    return;
  }

  // Ambos botones abren el mismo modal de email
  await showEmailModal(interaction);
}

async function showEmailModal(interaction) {
  const modal = new ModalBuilder()
    .setCustomId(MODAL_IDS.EMAIL_REGISTRATION)
    .setTitle('Registro de Usuario');

  const emailInput = new TextInputBuilder()
    .setCustomId(INPUT_IDS.EMAIL)
    .setLabel('Correo Electrónico')
    .setPlaceholder('ejemplo@correo.com')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMinLength(5)
    .setMaxLength(100);

  const row = new ActionRowBuilder().addComponents(emailInput);
  modal.addComponents(row);

  await interaction.showModal(modal);
}

async function handleModalSubmit(interaction) {
  if (interaction.customId !== MODAL_IDS.EMAIL_REGISTRATION) {
    return;
  }

  const email = interaction.fields.getTextInputValue(INPUT_IDS.EMAIL);

  if (!isValidEmail(email)) {
    const errorEmbed = new EmbedBuilder()
      .setColor(COLORS.ERROR)
      .setTitle('❌ Error de Validación')
      .setDescription(
        'El correo electrónico ingresado no tiene un formato válido. Por favor, intenta de nuevo.'
      );

    const retryButton = createRetryButton();
    await interaction.reply({ embeds: [errorEmbed], components: [retryButton], flags: MessageFlags.Ephemeral });
    return;
  }

  // Mostrar mensaje de "procesando"
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  console.log(`📧 Validando correo: ${email} - Usuario: ${interaction.user.tag}`);

  // Validar con HubSpot
  const validation = await validateContactInHubSpot(email);

  if (!validation.isValid) {
    const errorEmbed = createErrorEmbed(validation.reason);
    const retryButton = createRetryButton();
    await interaction.editReply({ embeds: [errorEmbed], components: [retryButton] });
    return;
  }

  // Usuario válido - mostrar éxito y asignar rol
  const successEmbed = new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Registro Completado')
    .setDescription(
      `¡Bienvenido, **${interaction.user.username}**!\n\nTu cuenta ha sido verificada correctamente. Ahora tienes acceso completo al servidor.`
    )
    .addFields(
      {
        name: '📧 Correo Verificado',
        value: email,
      },
      {
        name: '👀 ¿No ves los canales?',
        value: 'Si no aparecen los nuevos canales automáticamente, haz clic derecho en el servidor → **"Mostrar todos los canales"** o reinicia Discord.',
      }
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [successEmbed] });

  // Quitar rol "No Verificado" al usuario
  await removeUnverifiedRole(interaction);
}

function createErrorEmbed(reason) {
  let title = '❌ Error de Verificación';
  let description = '';

  switch (reason) {
    case 'not_found':
      description = `No hemos encontrado tu correo en nuestro sistema.\n\n**¿Necesitas ayuda?**\nContacta con soporte: **${SUPPORT_EMAIL}**`;
      break;
    case 'no_deals':
      description = `Tu cuenta no tiene una suscripción activa.\n\n**¿Necesitas ayuda?**\nContacta con soporte: **${SUPPORT_EMAIL}**`;
      break;
    default:
      description = `Ha ocurrido un error al verificar tu cuenta.\n\n**¿Necesitas ayuda?**\nContacta con soporte: **${SUPPORT_EMAIL}**`;
  }

  return new EmbedBuilder()
    .setColor(COLORS.ERROR)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function createRetryButton() {
  const retryButton = new ButtonBuilder()
    .setCustomId(BUTTON_IDS.RETRY_VALIDATION)
    .setLabel('🔄 Reintentar Validación')
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder().addComponents(retryButton);
}

async function removeUnverifiedRole(interaction) {
  console.log(`🔍 Intentando quitar rol "No Verificado" (${UNVERIFIED_ROLE_ID}) a ${interaction.user.tag}...`);
  
  if (!UNVERIFIED_ROLE_ID) {
    console.warn('⚠️ UNVERIFIED_ROLE_ID no está configurado. No se puede quitar el rol.');
    return;
  }

  try {
    const guilds = interaction.client.guilds.cache;
    
    for (const [, guild] of guilds) {
      try {
        const member = await guild.members.fetch(interaction.user.id);
        if (member) {
          // Quitar rol "No Verificado"
          await member.roles.remove(UNVERIFIED_ROLE_ID);
          console.log(`✅ Rol "No Verificado" removido de ${interaction.user.tag} en ${guild.name}`);
          
          // Restaurar roles guardados
          await restoreSavedRoles(member, guild);
          return;
        }
      } catch (err) {
        console.log(`⚠️ Error en servidor ${guild.name}: ${err.message}`);
      }
    }
    console.warn('⚠️ No se encontró al usuario en ningún servidor');
  } catch (error) {
    console.error(`❌ Error removiendo rol de ${interaction.user.tag}:`, error.message);
  }
}

/**
 * Restaura los roles guardados al usuario después de completar la verificación
 * @param {GuildMember} member - Miembro del servidor
 * @param {Guild} guild - Servidor de Discord
 */
async function restoreSavedRoles(member, guild) {
  const savedRoleIds = getRoles(guild.id, member.user.id);
  
  if (savedRoleIds.length === 0) {
    console.log(`ℹ️ No hay roles guardados para restaurar a ${member.user.tag}`);
    return;
  }
  
  try {
    // Filtrar roles que aún existen en el servidor
    const validRoles = savedRoleIds.filter(roleId => guild.roles.cache.has(roleId));
    
    if (validRoles.length > 0) {
      await member.roles.add(validRoles);
      console.log(`🔄 Roles restaurados a ${member.user.tag}: [${validRoles.join(', ')}]`);
    }
    
    // Limpiar los roles del store
    clearRoles(guild.id, member.user.id);
  } catch (error) {
    console.error(`❌ Error al restaurar roles de ${member.user.tag}:`, error.message);
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
