import { createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, AudioPlayer } from '@discordjs/voice';
import { join as joinVoice } from './join';
import { stop } from './stop';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import ytpl from 'ytpl';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Player, VideoMetaData } from 'src/types';
import { ChatInputCommandInteraction, GuildMember, InternalDiscordGatewayAdapterCreator } from 'discord.js';

const players: {[guildId: string]: Player} = global.players;


const streamSource = (video: VideoMetaData) => {
	const downloaded = ytdl(video.id, {
		filter: 'audioonly',
		highWaterMark: 1 << 62,
		// liveBuffer: 1 << 62,
		// disabling chunking is recommended in discord bot
		dlChunkSize: 0,
		quality: 'highestaudio',
	});

	return createAudioResource(downloaded);
};

const search = async (message: string) : Promise<VideoMetaData[]> => {
	// if (ytdl.validateURL(message) || ytdl.validateID(message)) {
	// 	return message;
	// }

	if (ytpl.validateID(message)) {
		// TODO: Make queue
		console.log('Playlist!');
		return [];
	}

	const meta = await ytsr(message, { limit: 1 });
	const res = meta.items[0] as any;

	let data = {
		name: res.title,
		id: res.id,
		url: res.url,
		duration: res.duration
	}
	return [data];
};

const streamPlay = async (message: string, guildId: string, voiceAdapterCreator: InternalDiscordGatewayAdapterCreator, channelId: string) => {
	const connection = joinVoice(guildId, voiceAdapterCreator, channelId);
	let player: AudioPlayer;

	const video = await search(message);
	console.log(video);

	if (players[guildId]) {
		const info = players[guildId];
		player = info.player;
		if (player.state.status === 'playing') {
			info.queue.push(...video);
			console.log('Added to queue');
			return true;
		}
		if (players[guildId].timeout) {
			clearTimeout(players[guildId].timeout);
			players[guildId].timeout = undefined;
		}
	}
	else {
		console.log('New Player');
		player = createAudioPlayer();
		connection.subscribe(player);
		players[guildId] = { player: player, queue: [], loop: false, current: video[0], skip: false, timeout: undefined };
	}

	let resource = streamSource(video[0]);
	player.play(resource);

	
	// Events
	player.on(AudioPlayerStatus.Playing, () => {
		console.log('Playing!');
	});
	player.on('error', error => {
		console.error(`Error: ${error.message}`);
	});

	player.on(AudioPlayerStatus.Idle, () => {
		const metadata = players[guildId];
		if (!metadata.loop && metadata.queue.length === 0) {
			console.log('starting timeout');
			metadata.timeout = setTimeout(() => stop(guildId), 20000);
		}
		else {
			if (!metadata.loop || metadata.skip) {
				metadata.current = metadata.queue.shift();
				metadata.skip = false;
			}
			let current = metadata.current!
			resource = streamSource(current);
			player.play(resource);
		}
	});
	return false;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Plays a song")
		.addStringOption(option => 
			option.setName('input')
			.setDescription("The song you want to listen to, can be url or name")
			.setRequired(true)
		),
	async execute(interaction: ChatInputCommandInteraction) {
		let input = interaction.options.getString('input');
		let guildId = interaction.guildId || null;
		let voiceAdapter = interaction.guild ? interaction.guild.voiceAdapterCreator : null;
		let member = interaction.member ? interaction.member as GuildMember : null;
		let voiceId = member ? member.voice.channelId : null;

		if (input && guildId && voiceAdapter && voiceId){
			const first = streamPlay(input, guildId, voiceAdapter, voiceId);
			await interaction.reply(!first ? "Playing" : "Added To Queue");
		}
	}
};