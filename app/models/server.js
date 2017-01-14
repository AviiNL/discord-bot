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


let dnsResolver =  function(next) {
    console.log("====== find[One] ======");
    if(this instanceof mongoose.Query) {

        if(Object.keys(this._conditions).length === 0 && this._conditions.constructor === Object) {
            next();
        }

        let test = /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;

        if(test.test(this._conditions.ip)) {
            next();
        }

        dns.resolve4(this._conditions.ip, (err, result) => {
            console.log(result);
            next();
        });
    }
};


ServerSchema.pre('find', dnsResolver);
ServerSchema.pre('findOne', dnsResolver);

module.exports   = mongoose.model('Server', ServerSchema);