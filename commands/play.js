// TODO --- THIS IS NOT CORRECT. I need to look more into this. Don't use for now

const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, getVoiceConnection, 
				createAudioResource, joinVoiceChannel,
				StreamType
			} = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a Song!')
		.addStringOption(option =>
      option.setName('input')
        .setDescription('Link or name of song to play')
        .setRequired(true)),

	async execute(interaction) {
		let connection = getVoiceConnection(interaction.guildId);
		if (!connection){
			connection = joinVoiceChannel({
				channelId: interaction.member.voice.channel.id,
				guildId: interaction.guildId,
				adapterCreator: interaction.guild.voiceAdapterCreator
			})
		}

		const downloaded = ytdl(interaction.options.getString('input'), 
		{
			quality: "highestaudio",
			filter: format => format.container === 'webm'
		});

		const resource = createAudioResource(downloaded, {
				inputType: StreamType.WebmOpus
		});

		/*
    const resource = createAudioResource(
			interaction.options.getString('input'),
		{ inlineVolume: true});
		//resource.volume.setVolume(0.2);*/

		const player = createAudioPlayer();
		connection.subscribe(player)
		player.play(resource);
		console.log("done");
		interaction.reply('playing!');
	},
};
