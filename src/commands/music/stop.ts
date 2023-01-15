import { getVoiceConnection } from '@discordjs/voice';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { Players } from '../../players';

const players = Players.players;


export const stop = (guildId: string): void => {
	const connection = getVoiceConnection(guildId);
	if (connection) connection.destroy();
	if (players[guildId]) delete players[guildId];
	return;
}

module.exports = {

	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music player and disconnects from VC'),


	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) return;
		stop(interaction.guildId);
		await interaction.reply('Bye Bye');
	},

	stop: stop

};