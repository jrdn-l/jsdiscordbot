const players = global.players;
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Resumes music if possible'),
	
	async execute(interaction) {
		this.resume(interaction.guildId);
		await interaction.reply('Resuming');
	},

	resume(guildId) {
		const player = players[guildId].player;
		if (!players[guildId]) return;
		if (player.state.status == 'paused') {
			player.unpause();
			console.log('resume!');
		}
	},
};