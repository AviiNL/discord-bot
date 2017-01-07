const Command = require('../command');
const discord = require('../index');

const Role = require('../../../models/role');
const User = require('../../../models/user');

module.exports = class extends Command {

    run(action, type, name, commands) {
        if (commands === undefined) {
            commands = [];
        } else {
            commands = commands.split(' ');
        }

        switch (action) {
            case 'list':
                User.find({'guildid': this.guild.id}, (err, permissions) => {
                    if (err) {
                        console.error(err);
                    }
                    if (!permissions) {
                        console.log("No permissions");
                    }
                    console.log("User permissions", permissions);
                });

                Role.find({'guildid': this.guild.id}, (err, permissions) => {
                    if (err) {
                        console.error(err);
                    }
                    if (!permissions) {
                        console.log("No permissions");
                    }
                    console.log("Roles permissions", permissions);
                });
                break;
            case 'add':
                if ('user' === type) {
                    let member;
                    if (false !== (member = discord.findMember(this.guild, name))) {
                        User.findOne({'guildid': this.guild.id, 'userid': member.id}, (err, user) => {
                            if (err) {
                                return console.error(err);
                            }

                            if (!user) {
                                user = new User();
                            }

                            user.userid   = member.id;
                            user.guildid  = this.guild.id;
                            user.commands = commands;

                            user.save((err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        });
                    }

                }
                if ('role' === type) {
                    let group;
                    if (false !== (group = discord.findRole(this.guild, name))) {
                        Role.findOne({'roleid': group.id}, (err, role) => {
                            if (err) {
                                return console.error(err);
                            }

                            if (!role) {
                                role = new Role();
                            }

                            role.roleid   = group.id;
                            role.guildid  = this.guild.id;
                            role.commands = commands;

                            role.save((err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        });
                    }
                }
                break;
            case 'remove':
                if ('user' === type) {
                    let member;
                    if (false !== (member = discord.findMember(this.guild, name))) {
                        User.findOne({'guildid': this.guild.id, 'userid': member.id}, (err, user) => {
                            if (err) {
                                return console.error(err);
                            }

                            if (!user) {
                                user = new User();
                            }

                            user.remove((err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        });
                    }

                }
                if ('role' === type) {
                    let group;
                    if (false !== (group = discord.findRole(this.guild, name))) {
                        Role.findOne({'roleid': group.id}, (err, role) => {
                            if (err) {
                                return console.error(err);
                            }

                            if (!role) {
                                role = new Role();
                            }

                            role.remove((err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        });
                    }
                }
                break;
            case 'purge':
                User.remove({}, function(err,removed) {

                });
                Role.remove({}, function(err,removed) {

                });
                break;
            case 'can':

                break;
        }
    }
};
