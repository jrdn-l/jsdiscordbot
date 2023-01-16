import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { Players } from '../../players';

const players = Players.players;


module.exports = {

data: new SlashCommandBuilder()
	.setName("pause")
	.setDescription("Pause music if possible")
	,

	async execute(interaction: ChatInputCommandInteraction) {
		this.pause(interaction.guildId);
		await interaction.reply('Pausing');
	},

	pause(guildId: string): void {
		const player = players[guildId].player;
		if (!players[guildId]) return;

		if (player.state.status == 'playing') {
			player.pause();
			console.log('pausing');
		}
	},

};