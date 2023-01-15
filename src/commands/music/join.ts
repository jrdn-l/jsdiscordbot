import { SlashCommandBuilder } from '@discordjs/builders';
import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import { ChatInputCommandInteraction, GuildMember, InternalDiscordGatewayAdapterCreator } from 'discord.js';

export const join = (guildId: string, voiceAdapterCreator: InternalDiscordGatewayAdapterCreator, channelId: string)=> {
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

	async execute(interaction: ChatInputCommandInteraction) {
		let guildId = interaction.guildId || null;
		let voiceAdapter = interaction.guild ? interaction.guild.voiceAdapterCreator : null;
		let member = interaction.member ? interaction.member as GuildMember : null;
		let voiceId = member ? member.voice.channelId : null;

		if (guildId && voiceAdapter && voiceId)
			join(guildId, voiceAdapter, voiceId);
		await interaction.reply('Joining!');
	},
};