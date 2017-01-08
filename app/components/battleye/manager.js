const EventEmitter = require('events');
const Server       = require('../../models/server');
const BEServer     = require('./server');

class BEManager extends EventEmitter {

    constructor() {
        super();
        this.servers = {};
        var self = this;
        Server.find({}, (err, servers) => {
            if (err) {
                return console.error(err);
            }

            if (!servers) {
                return console.error('no servers');
            }

            servers.forEach((server) => {
                if (!this.servers.hasOwnProperty(server.guildid)) {
                    this.servers[server.guildid] = [];
                }

                let beserver = spawn(server);

                this.servers[server.guildid].push(beserver);
            });
        });
    }

    get(server) {

        var search = (_server) => {
            if (
                _server.bnode.config.ip === server.ip &&
                _server.bnode.config.port === server.rconport &&
                _server.bnode.config.rconPassword === server.password
            ) {
                return _server;
            }
        };

        let g;
        for (g in this.servers) {
            if (this.servers.hasOwnProperty(g)) {
                if (g === server.guildid) {
                    return this.servers[g].find(search);
                }
            }
        }
        return false;
    }

    restart(server) {
        var s = this.get(server);
        if (!s) {
            return false;
        }

        s.logout();
        s.login();
    }

    add(server) {
        if (this.get(server)) {
            return false;
        }

        if (!this.servers.hasOwnProperty(server.guildid)) {
            this.servers[server.guildid] = [];
        }

        let beserver = spawn(server);

        this.servers[server.guildid].push(beserver);
        return true;
    }

    remove(server) {
        var s = this.get(server);
        if (!s) {
            return false;
        }

        s.logout();
        var i = this.servers[server.guildid].indexOf(s);
        if (i !== -1) {
            this.servers[server.guildid].splice(i, 1);
        }
    }

}

// Spawn helper function
function spawn(server) {
    let beserver = new BEServer(server);

    beserver.on('message', (message) => {
        console.log(`${server.ip}:${server.gameport}: ${message}`);
        self.emit('message', server, message);
    });

    beserver.on('respawn', () => {
        spawn(server);
    });

    return beserver;
}

// export as singleton
module.exports = new BEManager();