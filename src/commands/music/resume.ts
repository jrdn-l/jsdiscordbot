import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { Players } from '../../players';

const players = Players.players;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes music if possible'),
	
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) return;
		this.resume(interaction.guildId);
		await interaction.reply('Resuming');
	},

	resume(guildId: string) {
		const player = players[guildId].player;
		if (!players[guildId]) return;
		if (player.state.status == 'paused') {
			player.unpause();
			console.log('resume!');
		}
	},
};