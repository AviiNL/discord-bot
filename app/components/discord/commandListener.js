const discord = require('./index');
const User    = require('../../models/user');
const Role    = require('../../models/role');

discord.on("message", (guild, channel, message) => {
    let isCommand = message.toString().substr(0, 1) === '!';

    if (!isCommand) {
        return;
    }

    let args    = message.toString().substr(1).match(/(?:[^\s"]+|"[^"]*")+/g);
    let command = args.shift();

    authorize(message, command, (isAuthorized) => {

        if (!isAuthorized) {
            message.delete().catch(() => {
            }); // ignore error if we don't have permission
            return;
        }

        for (var i = 0; i < args.length; i++) {
            args[i] = args[i].replace(/"/g, '');
        }

        try {
            let func = require('./commands/' + command);

            let last = args.splice(func.length - 1).join(" ");
            args.push(last);

            let cmd = new func(message.guild, message.channel, message.member);
            cmd.run.apply(cmd, args);

        } catch (e) {
            console.error(e);
        }
    });
});

// This is a peice of shit that needs simplifing
// but mongoose is a bitch that it only allowes async calls and thus
// requires a fuckton of callbacks
function authorize(message, command, cb) {
    // always allow owner
    if (message.guild.owner === message.member) {
        return cb(true);
    }

    User.findOne({guildid: message.guild.id, userid: message.member.id})
        .then((user) => {
            var roleFinder = Role.findOne({guildid: message.guild.id, roleid: {"$in": message.member.roles.keyArray()}});

            if (!user) {
                return roleFinder;
            }

            if (user.commands.length > 0) {
                let has = (user.commands.indexOf(command) !== -1);
                if (!has) {
                    return roleFinder;
                }
                cb(has);
                return has;
            }

            cb(true);
            return true;
        }).then((role) => {
            if (typeof role !== "object") {
                return; // we got a bool back already, don't bother
            }

            if(!role) {
                cb(false);
                return false;
            }

            if (role.commands.length > 0) {
                let has = (role.commands.indexOf(command) !== -1);
                cb(has);
                return has;
            }

            cb(true);
            return true;
        }).catch((err) => {
            console.error(err);
            return cb(false);
        });
}