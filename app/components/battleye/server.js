const EventEmitter = require('events');
const BattleNode   = require('battle-node');
const Gamedig      = require('gamedig');

module.exports = class extends EventEmitter {
    constructor(server) {
        super();

        this.ip       = server.ip;
        this.gameport = server.gameport;

        this.bnode = new BattleNode({
            ip:           server.ip,
            port:         server.rconport,
            rconPassword: server.password
        });

        this.loggedOut = false;

        var timer;

        this.bnode.on('disconnected', function () {
            console.log('RCON server disconnected.');
            if (this.loggedOut) {
                timer = setInterval(() => {
                    console.log("Attempting to login again");
                    this.bnode.login();
                }, 2500);
            }
        });

        this.bnode.on('login', (err, success) => {
            if (!success) {
                return console.error("Unable to login");
            }

            console.log("RCON Logged in");
            if (timer && !err && success) {
                clearInterval(timer);
            }
        });

        this.bnode.on('message', (message) => {
            this.emit('message', message);
        });

        this.bnode.login();
    }

    getInfo(cb) {
        Gamedig.query(
            {
                type: 'arma3',
                host: this.ip,
                port: this.gameport,
            },
            function (state) {
                if (state.error) {
                    cb(false);
                }

                cb(state);
            }
        );
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