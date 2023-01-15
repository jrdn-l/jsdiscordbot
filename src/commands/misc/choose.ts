import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Picks a thing')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The items you want choosen from separated by spaces')
				.setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		const responses = interaction.options.getString('input')?.split(' ');
		if (!responses) return;
		await interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
	},
};
