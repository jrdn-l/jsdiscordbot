const players = global.players;
const { MessageEmbed, SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
	.setName("queue")
	.setDescription("Shows the current queue of songs"),
	
	async execute(interaction) {
		this.showQueue(message.guildId)
		//message.channel.send({ embeds: [] });
	},

	showQueue(guildId) {
		console.log(players[guildId].queue);
		const player = players[guildId];
		const queue = player.queue;

		// if (!queue) return message.channel.send(`No music currently playing`);

    //     //if (!queue.tracks[0]) return message.channel.send(`No music in the queue after the current one ${message.author}... try again ?`);

    //     const embed = new MessageEmbed();
    //     const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author}`);

    //     const songs = queue.length;
    //     const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;

    //     embed.setDescription(`Current ${queue.current.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);

    //     embed.setTimestamp();
		// 		return embed;
        
	},
};