const EventEmitter = require('events');
const Server       = require('../../models/server');
const BEServer     = require('./server');

class BEManager extends EventEmitter {

    constructor() {
        super();
        this.servers = {};
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
                let beserver = new BEServer(server.ip, server.port, server.password);

                beserver.on('message', (message) => {
                    let tmp = server;
                    delete tmp.password; // dont emit rcon password
                    this.emit('message', tmp, message);
                });

                this.servers[server.guildid].push(beserver);
            });
        });
    }

    get(server) {

        var search = (_server) => {
            if(
                _server.bnode.config.ip === server.ip &&
                _server.bnode.config.port === server.port &&
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
        if (!this.get(server)) {
            return false;
        }

        this.servers[server.guildid].push(new BEServer(server.ip, server.port, server.password));
        return true;
    }

    remove(server) {
        var s = this.get(server);
        if (!s) {
            return false;
        }

        s.logout();
        this.servers[server.guildid].remove(s);
    }

}

// export as singleton
module.exports = new BEManager();