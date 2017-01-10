const Command   = require('../command');
const discord   = require('../index');
const BEManager = require('../../battleye/manager');
const Server    = require('../../../models/server');
const Message   = require('../../../models/message');

module.exports = class extends Command {
    constructor(guild, channel, member) {
        super(guild, channel, member);
        this.description = "Enable/Disable Ingame Chat";
    }

    run(ip, port, action) {
        if (ip.indexOf(':') !== -1) {
            action = port;
            port   = ip.substr(ip.indexOf(':') + 1);
            ip     = ip.substr(0, ip.indexOf(':'));
        }

        switch (action) {
            case 'enable':
            case 'on':
                Server.findOne({guildid: this.guild.id, ip: ip, gameport: port})
                    .exec((err, server) => {
                        if (err) {
                            return console.error(err);
                        }
                        if (!server) {
                            return discord.say(this.guild, this.channel, `Server ${ip}:${port} does not exist`);
                        }
                        this.enable(server);
                    });
                break;
            case 'disable':
            case 'off':
                Server.findOne({guildid: this.guild.id, ip: ip, gameport: port})
                    .exec((err, server) => {
                        if (err) {
                            return console.error(err);
                        }
                        if (!server) {
                            return discord.say(this.guild, this.channel, `Server ${ip}:${port} does not exist`);
                        }
                        this.disable(server);
                    });
                break;
        }

    }

    enable(server) {
        // save which channel the server needs to broadcast in (array based, can be multiple)
        // start a listener (long running?) for the guild/channel and message

        Message.findOne({guildid: this.guild.id, channelid: this.channel.id, serverid: server._id})
            .exec((err, m) => {
                if(!m) {
                    m = new Message();
                }

                m.guildid = this.guild.id;
                m.channelid = this.channel.id;
                m.serverid = server._id;

                m.save();
                discord.say(this.guild, this.channel, `Chat messages **enabled** in this channel for ${server.ip}:${server.gameport}`);
            });
    }

    disable(server) {
        Message.findOne({guildid: this.guild.id, channelid: this.channel.id, serverid: server._id})
            .exec((err, m) => {
                if(!m) {
                    m = new Message();
                }

                m.remove();
                discord.say(this.guild, this.channel, `Chat messages **disabled** in this channel ${server.ip}:${server.gameport}`);
            });
    }

    help() {
        return '`!chat 127.0.0.1:2302 enable` will enable the ingame chat of the 127.0.0.1:2302 server interaction in the current channel\n' +
            '`!chat 127.0.0.1:2302 disable` will disable the ingame chat of the 127.0.0.1:2302 server interaction in the current channel\n' +
            'Note: This also includes connected and disconnected events';
    }
};