const players = global.players;
import { getVoiceConnection } from '@discordjs/voice';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {

	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Loops the current song if possible"),

	async execute(interaction: ChatInputCommandInteraction) {
		const res = this.loop(interaction.guildId);
		if (res === undefined) return;

		if (res) {
			await interaction.reply('Looping');
		}
		else {
			await interaction.reply('Unlooping');
		}
	},

	loop(guildId: string): void {
		const connection = getVoiceConnection(guildId);
		const data = players[guildId];
		if (data && connection) {
			data.loop = !data.loop;
		}
		return data.loop;
	},

};