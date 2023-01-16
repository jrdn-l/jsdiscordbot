import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { Players } from '../../players';

const players = Players.players;


module.exports = {

	data: new SlashCommandBuilder()
	.setName("skip")
	.setDescription('Skips the current song if there is one'),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) return;
		this.skip(interaction.guildId);
		await interaction.reply("skipping");
	},

	skip(guildId: string) {
		const player = players[guildId];
		player.skip = true;
		player.player.stop();
	},
};