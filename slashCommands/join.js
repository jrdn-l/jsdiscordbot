const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join a voice chat'),
	async execute(interaction) {
		await this.executeNoreply(interaction);
		interaction.reply("Joining!");
	},
	async executeNoReply(interaction) {
		return joinVoiceChannel({
			channelId: interaction.member.voice.channel.id,
			guildId: interaction.guildId,
			adapterCreator: interaction.guild.voiceAdapterCreator
		})
	}
};
