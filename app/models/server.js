// Load required packages
const mongoose = require('mongoose');
const dns = require('dns');

var ServerSchema = new mongoose.Schema({
    guildid:  {
        type:     String,
        required: true,
    },
    ip:       {
        type:     String,
        required: true,
    },
    gameport:     {
        type:     Number,
        required: true
    },
    rconport:     {
        type:     Number,
        required: true
    },
    password: {
        type:     String,
        required: true
    }
});


ServerSchema.pre('find', function(next) {
    console.log("====== find ======");
    if(this instanceof mongoose.Query) {
        console.log(this.ip);

        /*
        dns.resolve4(this.ip, (err, result) => {
            if(!err) {
                this.ip = result[0];
            }
            next();
        });
        */
        next();
    }
});

module.exports   = mongoose.model('Server', ServerSchema);