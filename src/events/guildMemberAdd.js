import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { BUTTON_IDS, COLORS, TERMS_OF_CONDUCT, UNVERIFIED_ROLE_ID } from '../config/constants.js';

export async function handleGuildMemberAdd(member) {
  if (!UNVERIFIED_ROLE_ID) {
    console.warn('⚠️ UNVERIFIED_ROLE_ID no está configurado.');
    return;
  }

  // Esperar un momento para que los roles externos se asignen (ej: desde enlace de invitación)
  await delay(2000);

  // Refrescar datos del miembro para obtener roles actualizados
  const refreshedMember = await member.fetch();

  // Comprobar si el usuario tiene el rol "No Verificado"
  const hasUnverifiedRole = refreshedMember.roles.cache.has(UNVERIFIED_ROLE_ID);

  if (!hasUnverifiedRole) {
    console.log(`✅ Usuario ${member.user.tag} no tiene rol "No Verificado". No requiere validación.`);
    return;
  }

  // El usuario tiene el rol "No Verificado" - enviar DM de verificación
  console.log(`🔒 Usuario ${member.user.tag} tiene rol "No Verificado". Iniciando flujo de verificación.`);
  await sendVerificationDM(member);
}

async function sendVerificationDM(member) {
  try {
    const welcomeEmbed = new EmbedBuilder()
      .setColor(COLORS.PRIMARY)
      .setTitle('👋 ¡Bienvenido al servidor!')
      .setDescription(
        `Hola **${member.user.username}**, antes de poder acceder al servidor necesitamos que completes un breve registro.`
      )
      .addFields(
        {
          name: '📋 Términos de Conducta',
          value: TERMS_OF_CONDUCT,
        },
        {
          name: '📝 Instrucciones',
          value:
            'Por favor, lee los términos de conducta y haz clic en el botón de abajo para aceptarlos e ingresar tu correo electrónico.',
        }
      )
      .setFooter({
        text: 'Al hacer clic en "Aceptar y Registrarme" confirmas que aceptas los términos.',
      })
      .setTimestamp();

    const acceptButton = new ButtonBuilder()
      .setCustomId(BUTTON_IDS.ACCEPT_TERMS)
      .setLabel('✅ Aceptar y Registrarme')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(acceptButton);

    await member.send({
      embeds: [welcomeEmbed],
      components: [row],
    });

    console.log(`📨 Mensaje de verificación enviado a ${member.user.tag}`);
  } catch (error) {
    console.error(
      `❌ No se pudo enviar DM a ${member.user.tag}:`,
      error.message
    );
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
