const Promise    = require('es6-promise');
const Command    = require('../command');
const Server     = require('../../../models/server');
const discord    = require('../index');
const AsciiTable = require('ascii-table');
const BEManager  = require('../../battleye/manager');

module.exports = class extends Command {

    constructor(guild, channel, member) {
        super(guild, channel, member);
        this.description = "Server management command";
    }

    run(action, ip, gameport, rconport, password) {

        if (ip.indexOf(':') !== -1) {
            password = rconport;
            rconport = gameport;
            gameport = ip.substr(ip.indexOf(':') + 1);
            ip       = ip.substr(0, ip.indexOf(':'));
        }

        switch (action) {
            case 'list':
                Server.find({guildid: this.guild.id})
                    .exec((err, servers) => {
                        if (err) {
                            return console.error(err);
                        }

                        if (servers.length === 0) {
                            return discord.say(this.guild, this.channel, "*No servers found!*");
                        }

                        let table = new AsciiTable('Servers');

                        table.setHeading('IP', 'GamePort', 'RconPort', 'Name');

                        // Promises....
                        let promises = [];
                        servers.forEach((server) => {
                            let tmpPromise = new Promise((resolve) => {
                                BEManager.get(server).getInfo((info) => {
                                    table.addRow(server.ip, server.gameport, server.rconport, info ? info.name : 'OFFLINE');
                                    return resolve();
                                });
                            });
                            promises.push(tmpPromise);
                        });

                        Promise.all(promises).then(() => {
                            discord.say(this.guild, this.channel, '```' + table + '```');
                        });

                    });
                break;
            case 'add':
                Server.findOne({guildid: this.guild.id, ip: ip, gameport: gameport})
                    .exec((err, server) => {
                        if (err) {
                            return console.error(err);
                        }

                        if (!server) {
                            server = new Server();
                        }

                        server.guildid  = this.guild.id;
                        server.ip       = ip;
                        server.gameport = gameport;
                        server.rconport = rconport;
                        server.password = password;

                        server.save((err, server) => {
                            if (err) {
                                return console.error(err);
                            }
                            discord.say(this.guild, this.channel, `${server.ip}:${server.gameport} successfully added`);
                            BEManager.add(server);
                        });
                    });
                break;
            case 'remove':
                Server.findOneAndRemove({guildid: this.guild.id, ip: ip, gameport: gameport})
                    .exec((err, server) => {
                        if (err) {
                            return console.error(err);
                        }

                        if (!server) {
                            return discord.say(this.guild, this.channel, `Server ${ip}:${gameport} does not exist`);
                        }

                        discord.say(this.guild, this.channel, `${server.ip}:${server.gameport} successfully removed`);
                        BEManager.remove(server);
                    });
                break;
            case 'players': {
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
                            beserver.send("players", (players) => {
                                discord.say(this.guild, this.channel, '```' + players + '```');
                            });
                        }
                    });
                break;
            }
        }

    }

    help() {
        return '!server [action] [ip[:port| port]] [rconport] [rconpassword]\n' +
            '*Actions:* `list` `add` `remove` `players`\n' +
            'All existing servers can be resolved using `ip:port` or `ip port`\n' +
            'Port specification can either be within the ip with a colon, or space seperated as the next parameter\n' +
            '`!server list` will show a list of all the servers registered to this discord server\n' +
            '`!server add localhost:2302 2307 testing` will add the server localhost:2302 to the system\n' +
            'where the rcon porst is 2307 and the rcon password is testing\n' +
            '`!server remove localhost:2302` will remove the server\n' +
            '`!server players localhost:2302` will show the list of players currently on the server';
    }

};