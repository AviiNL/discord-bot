const Command    = require('../command');
const discord    = require('../index');
const getParams  = require('get-parameter-names');
const fs         = require('fs');
const AsciiTable = require('ascii-table');

module.exports = class extends Command {

    constructor(guild, channel, member) {
        super(guild, channel, member);
        this.description = "Help";
    }

    run(command) {

        if (!command) {
            let files = fs.readdirSync(__dirname);

            let table = new AsciiTable('Help');
            table.setHeading('Command', 'Parameters');

            for (let i in files) {
                if (files.hasOwnProperty(i)) {
                    let file = files[i].replace('.js', '');

                    let _class = require(__dirname + '/' + file);
                    let load   = new _class(this.guild, this.channel, this.member);

                    let description = '';
                    let params      = getParams(load.run) || [];
                    if (load.description !== undefined) {
                        description = load.description;
                    }

                    table.addRow(file, params.join(' '));
                }
            }

            discord.say(this.guild, this.channel, '```' + table + '```\n\ntype: `!help [command]` for details about a specific command');
        } else {
            try {
                let _class = require(__dirname + '/' + command);
                let load   = new _class(this.guild, this.channel, this.member);
                let description = '';
                let help = '';
                let params      = getParams(load.run) || [];
                if (load.description !== undefined) {
                    description = load.description;
                }

                if(typeof load.help === 'function') {
                    help = load.help();
                }

                discord.say(this.guild, this.channel,`**Command:** ${command}\n**Paramaters:** ${params.join(" ")}\n**Description:** ${description}\n**Info:**\n${help}`);


            } catch (e) {
            }
        }
    }

    help() {
        return "use !help [command] to get information about a specific command";
    }

};