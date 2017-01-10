const BEManager = require('./manager');
const Message   = require('../../models/message');
const discord   = require('../discord');

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

function chat(m, message) {
    let parser = /\((.*?)\) (.*?): (.+)/;

    if (!parser.test) {
        return;
    }

    let matches = parser.exec(message);
    let channel = matches[1];
    let name    = matches[2];
    let msg     = matches[3];

    console.log(`[${channel}] **${name}**: ${msg}`);

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

    if (!parser.test) {
        return;
    }

    let matches = parser.exec(message);
    let name    = matches[3];

    discord.say(m.guildid, m.channelid, `**${name}** connected`);
}

function disconnect(m, message) {
    let parser = /Player #(\d+) (.*?) disconnected/;
    if (!parser.test) {
        return;
    }

    let matches = parser.exec(message);
    let name    = matches[2];

    discord.say(m.guildid, m.channelid, `**${name}** disconnected`);
}