const { SlashCommandBuilder } = require('@discordjs/builders');
const { play } = require('../commands/music.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a Song!')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('Link or name of song to play')
				.setRequired(true)),

	async execute(interaction) {
		let message = interaction.options.getString('input');

		play(message, interaction.guildId, interaction.guild.voiceAdapterCreator, interaction.member.voice.channel.id);
		interaction.reply('playing!');
	}
};
