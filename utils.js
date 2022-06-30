module.exports = {
  getTextChannel: (client, guildId, channelId) => {
    return client.guilds.cache.get(guildId).channels.cache.get(channelId);
  }
}