const { getVoiceConnection } = require('@discordjs/voice');
const players = global.players;

module.exports = {
	name: 'stop',
	utilisation: '{prefix}stop',
	voiceChannel: true,

	async execute(client, message) {
		this.stop(message.guildId);
		message.react('⏹');
	},

	stop(guildId) {
		const connection = getVoiceConnection(guildId);
		if (connection) connection.destroy();

		if (players[guildId]) delete players[guildId];

	},
};