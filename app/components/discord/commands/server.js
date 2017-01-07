const Command    = require('../command');
const Server     = require('../../../models/server');
const discord    = require('../index');
const AsciiTable = require('ascii-table');
const BEManager  = require('../../battleye/manager');

module.exports = class extends Command {

    run(action, ip, port, password) {
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

                        table.setHeading('IP', 'Port');

                        servers.forEach((server) => {
                            table.addRow(server.ip, server.port);
                        });

                        discord.say(this.guild, this.channel, '`' + table + '`');

                    });
                break;
            case 'add':
                Server.findOne({guildid: this.guild.id, ip: ip, port: port})
                    .exec((err, server) => {
                        if (err) {
                            return console.error(err);
                        }

                        if (!server) {
                            server = new Server();
                        }

                        server.guildid  = this.guild.id;
                        server.ip       = ip;
                        server.port     = port;
                        server.password = password;

                        server.save((err, server) => {
                            if (err) {
                                return console.error(err);
                            }
                            discord.say(this.guild, this.channel, `${server.ip}:${server.port} successfully added`);
                            BEManager.add(server);
                        });
                    });
                break;
            case 'remove':
                Server.findOneAndRemove({guildid: this.guild.id, ip: ip, port: port})
                    .exec((err, server) => {
                        if (err) {
                            return console.error(err);
                        }

                        if (!server) {
                            return discord.say(this.guild, this.channel, `Server ${ip}:${port} does not exist`);
                        }

                        discord.say(this.guild, this.channel, `${server.ip}:${server.port} successfully removed`);
                        BEManager.remove(server);
                    });
                break;
            case 'players': {
                Server.findOne({guildid: this.guild.id, ip: ip, port: port})
                    .exec((err, server) => {
                        if (err) {
                            return console.error(err);
                        }

                        if (!server) {
                            return discord.say(this.guild, this.channel, `Server ${ip}:${port} does not exist`);
                        }

                        let beserver = BEManager.get(server);
                        beserver.send("players", (players) => {
                            discord.say(this.guild, this.channel, '`'+players+'`');
                        });
                    });
                break;
            }
        }

    }

};