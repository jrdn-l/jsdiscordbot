const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = [];
const innerPaths = [];
fs.readdirSync(commandsPath).forEach((folder) => {
	let folderpath = path.join(commandsPath, folder);
	files = fs.readdirSync(folderpath).filter(file => file.endsWith('js'));
	commandFiles.push(...files);
	for (_ of files)
		innerPaths.push(folderpath);
});

commandFiles.forEach((file, index) => {
	const filePath = path.join(innerPaths[index], file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
})

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
