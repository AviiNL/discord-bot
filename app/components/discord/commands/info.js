// !players command, instead of using !server players
const Command    = require('../command');
const Server     = require('../../../models/server');
const discord    = require('../index');
const BEManager  = require('../../battleye/manager');

module.exports = class extends Command {

    constructor(guild, channel, member) {
        super(guild, channel, member);
        this.description = "Info";
    }

    run(ip, gameport) {

        if (ip.indexOf(':') !== -1) {
            gameport = ip.substr(ip.indexOf(':') + 1);
            ip       = ip.substr(0, ip.indexOf(':'));
        }

        Server.findOne({guildid: this.guild.id, ip: ip, gameport: gameport})
            .exec((err, server) => {
                if (err) {
                    return console.error(err);
                }
                if (!server) {
                    return discord.say(this.guild, this.channel, `Server ${ip}:${gameport} does not exist`);
                }

                let beserver;
                if (false !== (beserver = BEManager.get(server))) {
                    beserver.getInfo((info) => {
                        if(info) {
                            console.log(info);
                        }
                    });
                }
            });

    }

    help() {
        return '`!info [ip] [port]` gets information about the server';
    }
};