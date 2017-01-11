const EventEmitter = require('events');
const BattleNode   = require('battle-node');

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

        this.bnode.on('disconnected', () => {
            console.log('RCON server disconnected.');
            if (!this.loggedOut) {
                console.log("Attempting to login again");
                this.emit('respawn', this);
            }
        });

        this.bnode.on('login', (err, success) => {
            if (!success) {
                return console.error("Unable to login", `${server.ip}:${server.rconport}`);
            }

            console.log("RCON Logged in");
            if (timer && !err && success) {
                clearInterval(timer);
            }
        });

        this.bnode.on('message', (message) => {
            // Don't ever send RCon messages
            if(message.startsWith("RCon admin #")) { return; }
            this.emit('message', message);
        });

        this.bnode.login();
    }

    getInfo(cb) {
        delete require.cache[require.resolve('gamedig')];
        let gamedig = require('gamedig');
        gamedig.query(
            {
                type:       'arma3',
                host:       this.ip,
                port:       this.gameport,
                udpTimeout: 3000
            },
            function (state) {
                if (state.hasOwnProperty('error')) {
                    console.error(state);
                    return cb(false);
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
        // this.bnode.disconnect();
        this.bnode.socket.close();
    }
};