// TODO --- THIS IS NOT CORRECT. I need to look more into this. Don't use for now

const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const join = require("./join.js");
const ytdl = require('ytdl-core');
const players = require("../test.json");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a Song!')
		.addStringOption(option =>
      option.setName('input')
        .setDescription('Link or name of song to play')
        .setRequired(true)),

	async execute(interaction) {

		const connection = await join.executeNoReply(interaction);
		const downloaded = ytdl(interaction.options.getString('input'), 
		{
			quality: "highestaudio",
			filter: format => format.container === 'webm'
		});

		let player;
		if (players[interaction.guildId]){
			player = players[interaction.guildId].player;
			//console.log(player);
			if (player.state.status === 'playing'){
				players[interaction.guildId].queue.push(interaction.options.getString('input'));
				interaction.reply("Added to Queue");
				return;
			}
		} else {
			console.log("New Player")
			player = createAudioPlayer();
			connection.subscribe(player)
			players[interaction.guildId] = { player: player, queue: [] };
		}


		const resource = createAudioResource(downloaded, {
				inputType: StreamType.WebmOpus
		});

		/*
    const resource = createAudioResource(
			interaction.options.getString('input'),
		{ inlineVolume: true});
		//resource.volume.setVolume(0.2);*/
		player.play(resource);

		player.on(AudioPlayerStatus.Playing, () => {
			console.log('Playing!');
		})
		player.on('error', error => {
			console.error(`Error: ${error.message}`);
			//this.execute(interaction)
		});
		player.on(AudioPlayerStatus.Idle, () => {
			this.continue(interaction);
		});

		interaction.reply('playing!');
	},


	// * MAYBE DONT USE SLASH COMMANDS FOR NOW
	async continue(interaction){

	}
};
