const EventEmitter = require('events');
const discord      = require('discord.js');

class Bot extends EventEmitter {

    constructor(config) {
        super();
        this.client = new discord.Client();

        this.client.once("ready", () => {
            this.ready = true;

            console.log("Discord ready");
        });

        this.client.on("message", (message) => {
            if (message.author.bot) {
                return; // don't respond to bots
            }

            if (message.channel.hasOwnProperty('guild')) {
                // Channel message
                let guild   = message.guild.id;
                let channel = message.channel.id;
                this.emit("message", guild, channel, message);
            }
        });

        this.client.login(config.token);
    }

    say(guild, channel, message) {
        if(typeof guild === 'string') {
            guild = this.client.guilds.find((_guild) => _guild.id === guild);
        }
        if(typeof channel === "string") {
            channel = guild.channels.find((_channel) => _channel.id === channel);
        }

        if (channel) {
            channel.sendMessage(message);
        }
    }

    findRole(guild, name) {
        let roles = [];
        guild.roles.forEach((role) => {
            if(role.name.toLowerCase().startsWith(name.toLowerCase())) {
                roles.push(role);
            }
        });

        if (roles.length !== 1) {
            return false;
        }

        return roles[0];
    }

    findRoleByID(guild, roleid) {
        return guild.roles.get(roleid);
    }

    findMember(guild, name) {
        let members = [];
        guild.members.forEach((member) => {
            if(member.displayName.toLowerCase().startsWith(name.toLowerCase())) {
                members.push(member);
            }
        });

        if (members.length !== 1) {
            return false;
        }

        return members[0];
    }

    findMemberByID(guild, userid) {
        return guild.members.get(userid);
    }
}

// Return singleton
module.exports = new Bot(require('../../config.json').discord);