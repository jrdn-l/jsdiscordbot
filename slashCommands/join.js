const { SlashCommandBuilder } = require('@discordjs/builders');
const { join } = require("../commands/music.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join a voice chat'),
	async execute(interaction) {
		join(interaction.guildId, interaction.guild.voiceAdapterCreator, interaction.member.voice.channel.id);
		interaction.reply('Joining!');
	}
};
