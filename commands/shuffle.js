const shuffle = require('shuffle-array');
const players = global.players;

module.exports = {
	name: 'shuffle',
	utilisation: '{prefix}shuffle',
	voiceChannel: true,

	async execute(client, message) {
		message.react('✅');
		this.shuffleQueue(message.guildId);
	},

	shuffleQueue(guildId) {
		shuffle(players[guildId].queue);
	},
};