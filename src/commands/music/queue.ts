const players = global.players;
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Shows the current queue of songs"),

	async execute(interaction) {
		await this.showQueue(interaction, interaction.guildId)
	},

	async showQueue(interaction, guildId) {
		console.log(players[guildId].queue);
		const player = players[guildId];
		const queue = player.queue;

		if (!player.current) return interaction.reply(`No music currently playing`);

		if (queue.length == 0) return interaction.reply(`No music in the queue after the current one ${interaction.author}... try again ?`);

		const embed = new EmbedBuilder();
		const tracks = queue.map((track, i) => `**${i + 1}** - ${track.name}`);

		const songs = queue.length;
		const nextSongs = songs > 5 ? `And **${songs - 5}** other song(s)...` : `In the playlist **${songs}** song(s)...`;

		embed.setDescription(`Current ${player.current.name}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);

		embed.setTimestamp();
		await interaction.reply({embeds: [embed]});
		
	},
};