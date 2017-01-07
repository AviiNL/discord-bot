const EventEmitter = require('events');
const BattleNode = require('battle-node');

module.exports = class extends EventEmitter {
    constructor(ip, port, password) {
        super();
        this.bnode = new BattleNode({
            ip:           ip,
            port:         port,
            rconPassword: password
        });
        this.loggedOut = false;

        var timer;

        this.bnode.on('disconnected', function () {
            console.log('RCON server disconnected.');
            if(this.loggedOut) {
                timer = setInterval(() => {
                    console.log("Attempting to login again");
                    this.bnode.login(); // at this point all the events don't work anymor?
                }, 2500);
            }
        });

        this.bnode.on('login', (err, success) => {
            if(!success) {
                return console.error("Unable to login");
            }
            console.log("RCON Logged in");
            if(timer && !err && success) {
                clearInterval(timer);
            }
        });

        this.bnode.on('message', (message) => {
            this.emit('message', message);
        });

        this.bnode.login();
    }

    send(data, cb) {
        return this.bnode.sendCommand(data, cb);
    }

    login() {
        this.loggedOut = false;
        this.bnode.login();
    }

    logout() {
        this.loggedOut = true;
        this.bnode.disconnect();
    }
}