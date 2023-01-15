import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from '../config.json';

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = [];
const innerPaths = [];
readdirSync(commandsPath).forEach((folder) => {
	let folderpath = join(commandsPath, folder);
	files = readdirSync(folderpath).filter(file => file.endsWith('js'));
	commandFiles.push(...files);
	for (_ of files)
		innerPaths.push(folderpath);
});

commandFiles.forEach((file, index) => {
	const filePath = join(innerPaths[index], file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
})

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
