require('dotenv').config();
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = [];
const innerPaths = [];
readdirSync(commandsPath).forEach((folder) => {
	let folderpath = join(commandsPath, folder);
	let files = readdirSync(folderpath).filter(file => file.endsWith('ts'));
	commandFiles.push(...files);
	for (let _ of files)
		innerPaths.push(folderpath);
});

commandFiles.forEach((file, index) => {
	const filePath = join(innerPaths[index], file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
})

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
