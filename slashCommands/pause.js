const { SlashCommandBuilder } = require('@discordjs/builders');
const { pause } = require("../commands/music.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pause the song'),

	async execute(interaction) {
		pause(interaction.guildId);
	},

};