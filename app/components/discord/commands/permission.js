const Command = require('../command');
const discord = require('../index');

const Role = require('../../../models/role');
const User = require('../../../models/user');

const AsciiTable = require('ascii-table');

module.exports = class extends Command {

    run(action, type, name, commands) {

        if(commands) {
            let cmds = [];
            if (commands.length > 0) {
                cmds = commands.split(' ');
            }
            commands = cmds;
        } else {
            commands = [];
        }

        switch (action) {
            case 'list':
                User.find({'guildid': this.guild.id}, (err, permissions) => {
                    if (err) {
                        return console.error(err);
                    }

                    if (!permissions || permissions.length === 0) {
                        discord.say(this.guild, this.channel, "**No User based permissions found**");
                        return console.log("No user permissions");
                    }

                    let table = new AsciiTable("User Permissions");
                    table.setHeading("User", "Permissions");

                    for(let i in permissions) {
                        if(permissions.hasOwnProperty(i)) {
                            var perm = permissions[i];
                            table.addRow(
                                discord.findMemberByID(this.guild, perm.userid).displayName,
                                perm.commands.length > 0 ? perm.commands.join(', ') : 'ALL'
                            );
                        }
                    }

                    discord.say(this.guild, this.channel, "`" + table + "`");
                });

                Role.find({'guildid': this.guild.id}, (err, permissions) => {
                    if (err) {
                        return console.error(err);
                    }
                    if (!permissions || permissions.length === 0) {
                        discord.say(this.guild, this.channel, "**No Role based permissions found**");
                        return console.log("No role permissions");
                    }

                    let table = new AsciiTable("Role Permissions");
                    table.setHeading("Role", "Permissions");

                    for(let i in permissions) {
                        if(permissions.hasOwnProperty(i)) {
                            var perm = permissions[i];
                            table.addRow(
                                discord.findRoleByID(this.guild, perm.roleid).name,
                                perm.commands.length > 0 ? perm.commands.join(', ') : 'ALL'
                            );
                        }
                    }

                    discord.say(this.guild, this.channel, "`" + table + "`");
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
                                    return console.error(err);
                                }

                                discord.say(this.guild, this.channel, `${member.displayName} has been granted ${commands.join(", ")} permissions`);
                            });
                        });
                    }

                }
                if ('role' === type) {
                    let group;
                    if (false !== (group = discord.findRole(this.guild, name))) {
                        Role.findOne({'guildid': this.guild.id, 'roleid': group.id}, (err, role) => {
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
                                    return console.error(err);
                                }
                                discord.say(this.guild, this.channel, `Everyone with the role ${group.name} has been granted ${commands.join(", ")} permissions`);
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
                                    return console.error(err);
                                }

                                discord.say(this.guild, this.channel, `Permissions for ${member.displayName} has been revoked`);
                            });
                        });
                    }

                }
                if ('role' === type) {
                    let group;
                    if (false !== (group = discord.findRole(this.guild, name))) {
                        Role.findOne({'guildid': this.guild.id, 'roleid': group.id}, (err, role) => {
                            if (err) {
                                return console.error(err);
                            }

                            if (!role) {
                                role = new Role();
                            }

                            role.remove((err) => {
                                if (err) {
                                    return console.error(err);
                                }

                                discord.say(this.guild, this.channel, `Permissions for ${group.name} has been revoked`);
                            });
                        });
                    }
                }
                break;
            case 'purge':
                User.remove({guildid: this.guild.id}).exec();
                Role.remove({guildid: this.guild.id}).exec();
                discord.say(this.guild, this.channel, "All permissions have been purged");
                break;
            case 'clean':
                // remove all user permissions of users that are no longer in this guild
                // remove all role permissions of roles that are no longer in this guild

                break;
        }
    }
};
