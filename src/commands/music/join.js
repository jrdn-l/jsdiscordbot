const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const join = (guildId, voiceAdapterCreator, channelId) => {
	const connection = getVoiceConnection(guildId);
	if (!connection) {
		return joinVoiceChannel({
			channelId: channelId,
			guildId: guildId,
			adapterCreator: voiceAdapterCreator,
		});
	}
	return connection;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription("Joins VC")
		.addStringOption(option => 
			option.setName("channel")
			.setDescription("VC name to join")),

	join: join,

	async execute(interaction) {
		join(interaction.guildId, interaction.guild.voiceAdapterCreator, interaction.member.voice.channel.id);
		await interaction.reply('Joining!');
	},
};