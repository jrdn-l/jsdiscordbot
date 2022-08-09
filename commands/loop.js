const players = global.players;
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
	name: 'loop',
	utilisation: '{prefix}loop',
	voiceChannel: true,

	async execute(client, message) {
		const res = this.loop(message.guildId);
		if (res === undefined) return;

		if (res) {
			message.react('✅');
		}
		else {
			message.react('❌');
		}
	},

	loop(guildId) {
		const connection = getVoiceConnection(guildId);
		const data = players[guildId];
		if (data && connection) {
			data.loop = !data.loop;
		}
		return data.loop;
	},

};