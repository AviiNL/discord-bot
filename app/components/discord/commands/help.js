const Command = require('../command');
const discord = require('../index');

module.exports = class extends Command {

    run(command) {



        // iterate over all files in current folder
        // get function's arguments
        // construct them
        // call help() if exists when arg is called

        discord.say(this.guild, this.channel, 'No one can help you!');
    }

    help() {
        return "Show this help text";
    }

};