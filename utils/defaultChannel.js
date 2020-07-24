const Long = require('long');

const getDefaultChannel = (guild) => {
  // get "original" default channel
  if(guild.channels.cache.has(guild.id))
    return guild.channels.cache.get(guild.id)

  // Check for a "general" channel, which is often default chat
  const generalChannel = guild.channels.cache.find(channel => channel.name === "general");
  if (generalChannel)
    return generalChannel;
  // Now we get into the heavy stuff: first channel in order where the bot can speak
  // hold on to your hats!
  return guild.channels.cache
   .filter(c => c.type === "text" &&
     c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
   .sort((a, b) => a.position - b.position ||
     Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber())
   .first();
}

module.exports = getDefaultChannel;
