const EventEmitter = require('events');

class Rcon extends EventEmitter {

    constructor(server, port, password) {
        super();
        console.log(server);
    }

}

module.exports = Rcon;