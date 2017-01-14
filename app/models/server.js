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


ServerSchema.pre(['find', 'findOne'], function(next, query) {
    console.log("====== find ======");
    if(this instanceof mongoose.Query) {

        let test = /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;

        //if(!test.test(ip)) {
            // no an ip, resolve dns
        //}

        console.log(query);

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