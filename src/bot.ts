import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { GatewayDispatchEvents, GatewayIntentBits, InteractionType, MessageFlags, Client } from '@discordjs/core';
import {config} from 'dotenv';

config();

let token = process.env.TOKEN || '';

// Create REST and WebSocket managers directly
const rest = new REST({ version: '10' }).setToken(token);

const gateway = new WebSocketManager({
	token,
	intents: GatewayIntentBits.GuildMessageTyping | GatewayIntentBits.Guilds,
	rest,
});

// Create a client to emit relevant events.
const client = new Client({ rest, gateway });

// Listen for interactions
// Each event contains an `api` prop along with the event data that allows you to interface with the Discord REST API
client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
	if (interaction.type !== InteractionType.ApplicationCommand || interaction.data.name !== 'ping') {
		return;
	}

	await api.interactions.reply(interaction.id, interaction.token, { content: 'Pong!', flags: MessageFlags.Ephemeral });
});

// Listen for the ready event
client.once(GatewayDispatchEvents.Ready, () => console.log('Ready!'));

// Start the WebSocket connection.
gateway.connect();