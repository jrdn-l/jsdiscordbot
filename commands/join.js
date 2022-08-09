const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'join',
	aliases: ['j'],
	utilisation: '{prefix}join [channel name]',
	voiceChannel: true,

	join(guildId, voiceAdapterCreator, channelId) {
		const connection = getVoiceConnection(guildId);
		if (!connection) {
			return joinVoiceChannel({
				channelId: channelId,
				guildId: guildId,
				adapterCreator: voiceAdapterCreator,
			});
		}
		return connection;
	},

	async execute(client, message) {
		this.join(message.guildId, message.guild.voiceAdapterCreator, message.member.voice.channel.id);
		message.channel.send('Joining!');
	},


};