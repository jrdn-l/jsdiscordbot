import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get info about a user or a server!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Info about a user')
				.addUserOption(option => option.setName('target').setDescription('The user')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Info about the server')),

	async execute(interaction: ChatInputCommandInteraction) {
		if (interaction.options.getSubcommand() === 'user') {
			const res = interaction.options.getUser('target');
			await interaction.reply(`Your tag: ${res? res.tag : "Undefined"}\nYour id: ${res? res.id: "Undefined"}`);
			console.log(interaction);
		}
		else {
			if (interaction.guild)
				await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		}
	},


};