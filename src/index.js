import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import { handleGuildMemberAdd } from './events/guildMemberAdd.js';
import { handleInteraction } from './handlers/registration.js';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.GuildMember],
});

client.once('clientReady', () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('guildMemberAdd', handleGuildMemberAdd);

client.on('interactionCreate', handleInteraction);

client.login(process.env.DISCORD_TOKEN);

