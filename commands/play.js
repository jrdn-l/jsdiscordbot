// TODO --- THIS IS NOT CORRECT. I need to look more into this. Don't use for now

const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a Song!'),
	async execute(interaction) {
		const player = createAudioPlayer({
            behaviors:{
                noSubscriber: NoSubscriberBehavior.Pause
            },
        });
        const resource = createAudioResource('C:/Users/Jordan/Documents/CSC301/finalprojectw22-allaboardgames/main/client/src/assets/sound/success-fanfare-trumpets-6185.mp3');
	},
};
