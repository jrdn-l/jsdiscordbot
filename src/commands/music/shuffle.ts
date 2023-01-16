import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import shuffle from 'shuffle-array';
import { Players } from '../../players';

const players = Players.players;


module.exports = {
	data: new SlashCommandBuilder()
	.setName("shuffle")
	.setDescription("Shuffles the queue"),

	
	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) return;
		this.shuffleQueue(interaction.guildId);
		await interaction.reply("Shuffled!")
	},

	shuffleQueue(guildId: string) {
		shuffle(players[guildId].queue);
	},
};