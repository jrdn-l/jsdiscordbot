const { createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const { join } = require('./join');
const { stop } = require('./stop');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const video = require('fluent-ffmpeg/lib/options/video');

const players = global.players;


const streamSource = (video) => {
	const downloaded = ytdl(video.id, {
		filter: 'audioonly',
		fmt: 'webm',
		highWaterMark: 1 << 62,
		// liveBuffer: 1 << 62,
		// disabling chunking is recommended in discord bot
		dlChunkSize: 0,
		quality: 'highestaudio',
	});

	return createAudioResource(downloaded, {
		inputType: StreamType.WebmOpus,
	});
};

const search = async (message) => {
	if (ytdl.validateURL(message) || ytdl.validateID(message)) {
		return message;
	}

	if (ytpl.validateID(message)) {
		// TODO: Make queue
		console.log('Playlist!');
		return;
	}

	const meta = await ytsr(message, { limit: 1 });
	const res = meta.items[0];
	data = {
		name: res.title,
		id: res.id,
		url: res.url,
		duration: res.duration
	}
	return [data];
};

module.exports = {
	name: 'play',
	utilisation: '{prefix}play [Song name/ URL]',
	voiceChannel: true,

	async streamPlay(message, guildId, voiceAdapterCreator, channelId) {
		const connection = join(guildId, voiceAdapterCreator, channelId);
		let player;

		const video = await search(message);
		//console.log(video);

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
			players[guildId] = { player: player, queue: [], loop: false, current: video, skip: false, timeout: undefined };
		}

		let resource = streamSource(video[0]);
		player.play(resource);

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
				resource = streamSource(metadata.current);
				player.play(resource);
			}
		});
		return false;
	},

	async execute(client, message, args) {
		const first = this.streamPlay(args.join(), message.guildId, message.guild.voiceAdapterCreator, message.member.voice.channel.id);
		!first ? message.channel.send('Playing!') : message.channel.send('Added to Queue');
	},


};