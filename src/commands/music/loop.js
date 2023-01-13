const players = global.players;
const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loops the current song if possible"),

	async execute(interaction) {
		const res = this.loop(interaction.guildId);
		if (res === undefined) return;

		if (res) {
			await interaction.reply('Looping');
		}
		else {
			await interaction.reply('Unlooping');
		}
	},

	loop(guildId) {
		const connection = getVoiceConnection(guildId);
		const data = players[guildId];
		if (data && connection) {
			data.loop = !data.loop;
		}
		return data.loop;
	},

};