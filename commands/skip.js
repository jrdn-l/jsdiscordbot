const players = global.players;

module.exports = {
	name: 'skip',
	utilisation: '{prefix}skip',
	voiceChannel: true,

	async execute(client, message) {
		this.skip(message.guildId);
		message.react('⏭');
	},

	skip(guildId) {
		const player = players[guildId];
		player.skip = true;
		player.player.stop();
	},
};