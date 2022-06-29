const { joinVoiceChannel, createAudioPlayer,
       createAudioResource, StreamType, 
       AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const fs = require('node:fs');
const shuffle = require('shuffle-array');
const players = {};
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');


const getAudioResource = (input) => {
  const downloaded = ytdl(input,
    {
      quality: "highestaudio",
      filter: format => format.container === 'webm'
    })
  // .pipe(fs.createWriteStream("audio.webm").on('finish', () => {
  //   player.play('./audio.webm')
  // }));

  return createAudioResource(downloaded, {
    inputType: StreamType.WebmOpus
  });
}

const search = async (message) => {
  if (ytdl.validateURL(message) || ytdl.validateID(message)){
    return message;
  }
  let meta = await ytsr(message, {limit: 1});
  return meta.items[0].id;
}

const play = async (message, guildId, voiceAdapterCreator, channelId) => {
  const connection = join(guildId, voiceAdapterCreator, channelId);
  let player;

  message = await search(message);

  if (players[guildId]) {
    info = players[guildId];
    player = info.player;
    if (player.state.status === 'playing') {
      info.queue.push(message);
      console.log("Added to queue")
      return;
    }
  } else {
    console.log("New Player")
    player = createAudioPlayer();
    connection.subscribe(player)
    players[guildId] = { player: player, queue: [], loop: false, current: message };
  }

  let resource = getAudioResource(message);
  player.play(resource);

  player.on(AudioPlayerStatus.Playing, () => {
    console.log('Playing!');
  })
  player.on('error', error => {
    console.error(`Error: ${error.message}`);
  });
  player.on(AudioPlayerStatus.Idle, () => {
    let metadata = players[guildId];
    if (!metadata.loop && metadata.queue.length === 0) {
      return;
    } else {
      if (!metadata.loop)
        metadata.current = metadata.queue.shift();;
      resource = getAudioResource(metadata.current);
      player.play(resource);
    }
  });
}

const join = (guildId, voiceAdapterCreator, channelId) => {
    let connection = getVoiceConnection(guildId);
    if (!connection)
      return joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        adapterCreator: voiceAdapterCreator
      })
    return connection;

}

const shuffleQueue = (guildId) => {
  shuffle(players[guildId].queue);
}

const pause = (guildId) => {
  let player = players[guildId].player;
  if (!players[guildId])
    return;

  if (player.state.status == 'playing') {
    player.pause();
    console.log("pausing");
  } else {
    player.unpause();
    console.log("unpausing");
  }
}

const stop = (guildId) => {
  const connection = getVoiceConnection(guildId);
  if (connection)
    connection.destroy();

  if (players[guildId])
    delete players[guildId];

}

const loop = (guildId) => {
  const connection = getVoiceConnection(guildId);
  let data = players[guildId];
  if (data && connection){
    data.loop = !data.loop;
  }
}

const showQueue = (guildId) => {
  console.log()
}


module.exports = {
  join,
  play,
  shuffleQueue,
  pause,
  stop,
  loop,
  showQueue
}