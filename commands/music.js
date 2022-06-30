// Imports
const { joinVoiceChannel, createAudioPlayer,
	createAudioResource, StreamType,
	AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const fs = require('node:fs');
// const { getTextChannel } = require('./utils');
const shuffle = require('shuffle-array');
const players = {};
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { prefix } = require('../config.json');


// Function for messageCreation Check
const checkMusic = async (client, message) => {
	if (message.content === `${prefix}join`) {
		join(message.guildId, message.guild.voiceAdapterCreator, message.member.voice.channel.id);
	}
	else if (message.content.startsWith(`${prefix}play`)) {
		await play(message.content.slice(6), message.guildId, message.guild.voiceAdapterCreator, message.member.voice.channel.id);
	}
	else if (message.content.startsWith(`${prefix}shuffle.`)) {
		message.react('✅');
		shuffleQueue(message.guildId);
	}
	else if (message.content.startsWith(`${prefix}pause`)) {
		pause(message.guildId);
		message.react('⏸');
	}
	else if (message.content.startsWith(`${prefix}resume`)) {
		resume(message.guildId);
		message.react('▶');
	}
	else if (message.content.startsWith(`${prefix}stop`)) {
		stop(message.guildId);
		message.react('⏹');
	}
	else if (message.content.startsWith(`${prefix}loop`)) {
		let res = loop(message.guildId);
		if (res === undefined) { return; }

		if (res) {
			message.react('✅');
		}
		else {
			message.react('❌');
		}

	}
	else if (message.content.startsWith(`${prefix}queue`)) {
		showQueue(message.guildId);
	}
	else if (message.content.startsWith(`${prefix}skip`)) {
		skip(message.guildId);
		message.react('⏭');
	}
};


// --------------------- HELPERS ---------------------
const playSource = (input, player) => {
	const downloaded = ytdl(input,
		{
			quality: 'highestaudio',
			filter: format => format.container === 'webm',
			requestOptions: { maxReconnects: 10, maxRetries: 10 },
		}).pipe(fs.createWriteStream("./audio.webm").on('finish', () => {
			let resource = createAudioResource("./audio.webm", {
				inputType: StreamType.WebmOpus,
			});
			player.play(resource);
		}));

	downloaded.on('reconnect', (number, err) => {
		console.log('RECONNECT', number, err);
		console.error(`Reconnect Error: ${err.message}`);
	});

	downloaded.on('retry', (number, err) => {
		console.log('RETRY:', number, err);
		console.error(`Retry Error: ${err.message}`);
	});
};

const search = async (message) => {
	if (ytdl.validateURL(message) || ytdl.validateID(message)) {
		return message;
	}
	const meta = await ytsr(message, { limit: 1 });
	return meta.items[0].id;
};


// --------------------- Functions  ---------------------
const play = async (message, guildId, voiceAdapterCreator, channelId) => {
	const connection = join(guildId, voiceAdapterCreator, channelId);
	let player;

	message = await search(message);

	if (players[guildId]) {
		let info = players[guildId];
		player = info.player;
		if (player.state.status === 'playing') {
			info.queue.push(message);
			console.log('Added to queue');
			return;
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
		players[guildId] = { player: player, queue: [], loop: false, current: message, skip: false, timeout: undefined };

		// Add events to the player
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
				resource = playSource(metadata.current, player);
			}
		});

	}

	let resource = playSource(message, player);
};

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

};

const shuffleQueue = (guildId) => {
	shuffle(players[guildId].queue);
};

const pause = (guildId) => {
	const player = players[guildId].player;
	if (!players[guildId]) { return; }

	if (player.state.status == 'playing') {
		player.pause();
		console.log('pausing');
	}
};

const resume = (guildId) => {
	const player = players[guildId].player;
	if (!players[guildId]) { return; }
	if (player.state.status == 'paused') {
		player.unpause();
		console.log('resume!');
	}
};

const stop = (guildId) => {
	const connection = getVoiceConnection(guildId);
	if (connection) { connection.destroy(); }

	if (players[guildId]) { delete players[guildId]; }

};

const loop = (guildId) => {
	const connection = getVoiceConnection(guildId);
	const data = players[guildId];
	if (data && connection) {
		data.loop = !data.loop;
	}
	return data.loop;
};

const showQueue = (guildId) => {
	console.log(players[guildId].queue);
};

const skip = (guildId) => {
	const player = players[guildId];
	player.skip = true;
	player.player.stop();
};


module.exports = {
	checkMusic,
	join,
	play,
	shuffleQueue,
	resume,
	pause,
	loop,
	stop,
	showQueue,
	skip,
};