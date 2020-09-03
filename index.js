const Discord = require('discord.js');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const getDefaultChannel = require('./utils/defaultChannel');
const {
  greetingMessage,
  bb8Info
} = require('./utils/greetingMessage');

require('dotenv').config();
const {
  DISCORD_TOKEN,
  PREFIX,
  // ZOMATO_TOKEN
} = process.env;

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', receivedMessage => {
  if (receivedMessage.author.bot) return;
  const args = receivedMessage.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    receivedMessage.channel.send("Pong.")
  } else if (command === "bb8") {
    receivedMessage.channel.send(bb8Info)
  } else {
    // receivedMessage.channel.send("Command not supported!")
  }
});

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  if (!newVoiceState) {
    return false
  }
  if (newVoiceState.streaming) {
    console.log(newVoiceState, 'MEMBEr')
    const channel = getDefaultChannel(newVoiceState.guild);
    const gameName = newVoiceState.member.user.presence.activities.length && newVoiceState.member.user.presence.activities[0].name || 'their screen';
    channel.send(`<@${newVoiceState.member.user.id}> is streaming ${gameName}. 🎥`)
  }
});


// client.on('presenceUpdate', (oldMember, newMember) => {
//   // const channel = oldMember.guild.channels.find(x => x.name === "channel name");
//   // if (!channel) return;
//   console.log(oldMember, newMember, 'XXX')
//   let oldStreamingStatus = oldMember.presence.game ? oldMember.presence.game.streaming : false;
//   let newStreamingStatus = newMember.presence.game ? newMember.presence.game.streaming : false;

//   if (oldStreamingStatus == newStreamingStatus) {
//     return;
//   }

//   if (newStreamingStatus) {
//     if (newMember.presence.game && newMember.presence.game.name === 'game name' || newMember.presence.game.details.match(/keywords in stream/gi)) {
//       console.log(`${newMember.user}, is live URL: ${newMember.presence.game.url}`);
//       return;
//     }
//   }
// });

client.on("guildCreate", (guild) => {
  const greeting = greetingMessage;
  const channel = getDefaultChannel(guild);
  channel.send(greeting);
});

client.login(DISCORD_TOKEN);
