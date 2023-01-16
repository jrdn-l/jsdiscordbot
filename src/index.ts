require('dotenv').config();
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ChatInputCommandInteraction, Client, Collection, CommandInteraction, Events, GatewayIntentBits, Interaction } from 'discord.js';
import { SlashCommand } from './types';


// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates
	]
});

const slashCommands = new Collection<string, SlashCommand>();

// Get slash commands
const slashCommandsPath = join(__dirname, 'commands');
const slashCommandFiles: string[] = [];
const innerPaths: string[] = [];
readdirSync(slashCommandsPath).forEach((folder) => {
	let folderpath = join(slashCommandsPath, folder);
	let files = readdirSync(folderpath).filter(file => file.endsWith('ts'));
	slashCommandFiles.push(...files);
	for (let _ of files)
		innerPaths.push(folderpath);
});

slashCommandFiles.forEach( (file, index) => {
	const filePath = join(innerPaths[index], file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	slashCommands.set(command.data.name, command);
})


// When the client is ready, run this code (only once)
client.once(Events.ClientReady, () => {
	console.log('Ready!');
	if (client.user)
		client.user.setPresence({ activities: [{ name: 'A New Game' }], status: 'online' });
});


client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (!interaction.isCommand()) return;
	const command = slashCommands.get(interaction.commandName);

	if (!command) return;

	try {
		command.execute(interaction);
	}
	catch (error) {
		console.log(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);
