const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the song"),

  async execute(interaction){
    const connection = getVoiceConnection();

    if (connection){
      interaction.reply('Pausing')
    }
    else {
      interaction.reply("Can't pause my dude")
    }
  }
  
}