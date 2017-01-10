const BEManager = require('./manager');
const Message   = require('../../models/message');
const discord   = require('../discord');
const Server    = require('../../models/server');
const emoji = require('emojione/lib/js/emojione.js');

BEManager.on('message', (server, message) => {

    Message.findOne({guildid: server.guildid, serverid: server._id})
        .exec((err, m) => {
            if (!err && m) {

                chat(m, message);
                connect(m, message);
                disconnect(m, message);
            }
        });

});

discord.on("message", (guild, channel, message) => {
    if (message.toString().startsWith('!')) {
        return; // dont send commands
    }

    Message.findOne({guildid: guild.id, channelid: channel.id})
        .exec((merr, m) => {

            if(merr) {
                return console.log(merr);
            }

            if(!m) {
                return console.error("Message data not found!");
            }

            Server.findOne({_id: m.serverid})
                .exec((serr, server) => {

                    if(serr) {
                        return console.log(serr);
                    }

                    if(!server) {
                        return console.error("Server not found!");
                    }

                    let emojiSuppored = emoji.toShort(message.toString());

                    BEManager.get(server).send(`say -1 [${message.member.displayName}]: ${emojiSuppored}`);
                });
        });
});

function chat(m, message) {
    let parser = /\((.*?)\) (.*?): (.+)/;

    if (!parser.test(message)) {
        return;
    }

    let matches = parser.exec(message);
    let channel = matches[1];
    let name    = matches[2];
    let msg     = matches[3];

    switch (channel.toLowerCase()) {
        case 'global':
        case 'side':
        case 'direct':
            // direct?
            discord.say(m.guildid, m.channelid, `[${channel}] **${name}**: ${msg}`);
            break;
    }

}

// idea, store GUID with a connected count counter to do fancy stuff (newbie, regular, veteran statusses or something)
function connect(m, message) {
    let parser = /Verified GUID \((.+)\) of player #(\d+) (.+)/;

    if (!parser.test(message)) {
        return;
    }

    let matches = parser.exec(message);
    let name    = matches[3];

    discord.say(m.guildid, m.channelid, `**${name}** connected`);
}

function disconnect(m, message) {
    let parser = /Player #(\d+) (.*?) disconnected/;

    if (!parser.test(message)) {
        return;
    }

    let matches = parser.exec(message);
    let name    = matches[2];

    discord.say(m.guildid, m.channelid, `**${name}** disconnected`);
}