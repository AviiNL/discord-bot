const path = require('path');

const rootDir = path.normalize(__dirname + "/../");
const config = require('./../config.json');

// Autoload these components
const components = [
    "discord",
    "discord/commandListener",
    "battleye/manager"
];

let loaded = [];

components.forEach((component) => {
    console.log("Loading " + component);

    var dir = path.normalize(rootDir + "/components/" + component);
    var confName = component.split(/[\/\\]/).shift();

    var loader = {
        'module': require(dir)
    };

    let conf;
    if((conf = config[confName]) !== undefined) {
        loader.config = conf;
    }

    loaded.push(loader);
});

loaded.forEach((func) => {
    if(typeof func.module === 'function') {
        if(func.hasOwnProperty('config')) {
            func.module.exports = new func.module(func.config);
        } else {
            func.module.exports = new func.module();
        }
    }
});