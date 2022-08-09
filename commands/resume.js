const players = global.players;

module.exports = {
	name: 'resume',
	utilisation: '{prefix}resume',
	voiceChannel: true,

	async execute(client, message) {
		this.resume(message.guildId);
		message.react('▶');
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