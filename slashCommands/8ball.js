const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Answers a question probably')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('The question you want answered')
				.setRequired(true)),
	async execute(interaction) {
		const responses = ['It is certain', 'It is decidedly so', 'Without a doubt',
			'Yes - definitely', 'You may rely on it', 'As I see it yes',
			'Most likely', 'Outlook good', 'Yes', 'Signs point to yes',
			'Ask again later', 'Cannot predict now', 'Concentrate and ask again',
			'Better not tell you now', 'Reply Hazy, try again',
			'My sources say no',
			'Don\'t count on it', 'My reply is no', 'Doubtful',
			'Outlook not so good'];

		await interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
	},
};
