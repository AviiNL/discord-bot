const Command = require('../command');
const discord = require('../index');

module.exports = class extends Command {
    constructor(guild, channel, member) {
        super(guild, channel, member);
        this.description = "Simple test command";
    }

    run() {
        discord.say(this.guild, this.channel, `Hello ${this.member.displayName}`);
    }

    help() {
        return 'The bot will reply with Hello [name]';
    }
};