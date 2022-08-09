const players = global.players;

module.exports = {
	name: 'pause',
	utilisation: '{prefix}pause',
	voiceChannel: true,

	async execute(client, message) {
		this.pause(message.guildId);
		message.react('⏸');
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