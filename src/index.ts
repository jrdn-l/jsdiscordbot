// Require the necessary discord.js classes
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ChatInputCommandInteraction, Client, Collection, GatewayIntentBits } from 'discord.js';
import { token, prefix } from './config.json';


// Create a new client instance
global.client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates
	]
});
const client = global.client;
global.players = {};

client.commands = new Collection();
client.slashCommands = new Collection();

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
	client.slashCommands.set(command.data.name, command);
})


// // Get text commands
// const commandsPath = path.join(__dirname, 'commands');
// const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
// for (const file of commandFiles) {
// 	const command = require(path.join(commandsPath, file));
// 	client.commands.set(command.name, command);
// 	// delete require.cache[require.resolve(path.join(commandsPath, file))];
// }

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	client.user.setPresence({ activities: [{ name: 'A New Game' }], status: 'online' });
});


client.on('interactionCreate', async (interaction: ChatInputCommandInteraction) => {
	if (!interaction.isCommand()) return;
	const command = client.slashCommands.get(interaction.commandName);

	if (!command) return;

	try {
		command.execute(interaction);
	}
	catch (error) {
		console.log(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// // Idk if I like this better or not. I'll have to see
// client.on('messageCreate', async message => {
// 	if (message.author.bot || message.channel.type === 'dm') return;
// 	console.log(message);
// 	if (!message.content.startsWith(prefix)) return;
// 	const args = message.cleanContent.slice(prefix.length).split(' ');
// 	const command = args.shift();
// 	const cmd = client.commands.get(command) || client.commands.find(item => item.aliases && item.aliases.includes(command));
// 	if (cmd) {
// 		await cmd.execute(client, message, args);
// 	}
// 	message.reply({content: JSON.stringify(message)});
// });

// Login to Discord with your client's token
client.login(token);
