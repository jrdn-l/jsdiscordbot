// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const music = require('./commands/music');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'slashCommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	client.user.setPresence({ activities: [{ name: 'A New Game' }], status: 'online' });
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.log(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Idk if I like this better or not. I'll have to see
client.on('messageCreate', async message => {
	if (message.content === '!join') {
		music.join(message.guildId, message.guild.voiceAdapterCreator, message.member.voice.channel.id);
	} else if (message.content.startsWith('!play')) {
		await music.play(message.content.slice(6), message.guildId, message.guild.voiceAdapterCreator, message.member.voice.channel.id);
	} else if (message.content.startsWith('!shuffle')){
		music.shuffle(message.guildId);
	} else if (message.content.startsWith('!pause')) {
		music.pause(message.guildId);
	} else if (message.content.startsWith('!stop')){
		music.stop(message.guildId)
	} else if (message.content.startsWith('!loop')){
		music.loop(message.guildId);
	}
});


// Login to Discord with your client's token
client.login(token);
