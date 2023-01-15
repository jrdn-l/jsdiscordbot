import { SlashCommandBuilder } from '@discordjs/builders';

const players = global.players;

module.exports = {

	data: new SlashCommandBuilder()
	.setName("skip")
	.setDescription('Skips the current song if there is one'),

	async execute(interaction) {
		this.skip(interaction.guildId);
		await interaction.reply("skipping");
	},

	skip(guildId) {
		const player = players[guildId];
		player.skip = true;
		player.player.stop();
	},
};