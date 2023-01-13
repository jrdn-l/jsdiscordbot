const { SlashCommandBuilder } = require('@discordjs/builders');
const shuffle = require('shuffle-array');
const players = global.players;

module.exports = {
	data: new SlashCommandBuilder()
	.setName("shuffle")
	.setDescription("Shuffles the queue"),

	
	async execute(interaction) {
		this.shuffleQueue(interaction.guildId);
		await interaction.reply("Shuffled!")
	},

	shuffleQueue(guildId) {
		shuffle(players[guildId].queue);
	},
};