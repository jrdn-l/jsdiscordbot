const { SlashCommandBuilder } = require('@discordjs/builders');

const players = global.players;

module.exports = {

data: new SlashCommandBuilder()
	.setName("pause")
	.setDescription("Pause music if possible")
	,

	async execute(interaction) {
		this.pause(interaction.guildId);
		await interaction.reply('Pausing');
	},

	pause(guildId) {
		const player = players[guildId].player;
		if (!players[guildId]) return;

		if (player.state.status == 'playing') {
			player.pause();
			console.log('pausing');
		}
	},

};