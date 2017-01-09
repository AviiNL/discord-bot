const BEManager = require('./manager');
const Message = require('../../models/message');
const discord = require('../discord');

BEManager.on('message', (server, message) => {

    Message.findOne({guildid: server.guildid, serverid: server._id})
        .exec((err, m) => {
            if(!err && m) {



                discord.say(m.guildid, m.channelid, message);
            }
        });

});