const Discord = require('discord.js');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const getDefaultChannel = require('./utils/defaultChannel');
const { greetingMessage, bb8Info } = require('./utils/greetingMessage');

require('dotenv').config();
const { DISCORD_TOKEN, PREFIX, ZOMATO_TOKEN } = process.env;
const { pref } = require ('./utils.json')

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  if (message.content.toLowerCase() === `${PREFIX}ping`) {
    message.channel.send('Pong.');
  } else if (message.content === `${PREFIX}bb8`) {
    // client.emit('guildMemberAdd', message.member);
    message.channel.send(bb8Info);
  }
	else {
          const args = receivedMessage.content.slice(pref.length).trim().split(/ +/);
          const command = args.shift().toLowerCase();
          console.log (command)
          if (command === "res")
          {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', 'https://developers.zomato.com/api/v2.1/locations?query=' + args.join (' '));
              xhr.setRequestHeader("Accept", "application/json")
              xhr.setRequestHeader("user-key", ZOMATO_TOKEN)

              // Track the state changes of the request.
              xhr.onreadystatechange = function () {
              var DONE = 4; // readyState 4 means the request is done.
              var OK = 200; // status 200 is a successful return.
              if (xhr.readyState === DONE) {
                  if (xhr.status === OK) {
                      var json = JSON.parse (xhr.responseText)
                      var etype = json.location_suggestions[0].entity_type
                      var eid = json.location_suggestions[0].entity_id
                  } else {
                      console.log('Error: ' + xhr.status); // An error occurred during the request.
                    }
                  }
              };
        xhr.send (null)
        }
    }
});

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  if (!newVoiceState) {return false}
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
