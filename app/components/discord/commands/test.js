const Command = require('../command');
const discord = require('../index');

module.exports = class extends Command {

    run() {
        discord.say(this.guild, this.channel, `Hello ${this.member.displayName}`);
    }

};