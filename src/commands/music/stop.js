const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
const players = global.players;

module.exports = {

	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stops the music player and disconnects from VC'),


	async execute(interaction) {
		this.stop(interaction.guildId);
		await interaction.reply('Bye Bye');
	},

	stop(guildId) {
		const connection = getVoiceConnection(guildId);
		if (connection) connection.destroy();
		if (players[guildId]) delete players[guildId];
	},
};