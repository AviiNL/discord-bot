const Command = require('../command');

module.exports = class extends Command {

    run() {
        console.log("Hello " + this.member.displayName);
    }

};