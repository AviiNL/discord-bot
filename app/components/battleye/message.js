const BEManager = require('./manager');
const Message = require('../../models/message');
const discord = require('../discord');

BEManager.on('message', (server, message) => {

    Message.findOne({guildid: server.guildid, serverid: server._id})
        .exec((err, m) => {
            if(!err && m) {

                // todo: Filter messages based on regex if:
                // Conncected (Verified GUID (**) of Player line
                // Player #n *** disconnected
                // () Name: Chat

                discord.say(m.guildid, m.channelid, message);
            }
        });

});