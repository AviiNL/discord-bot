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


let dnsResolverForFind =  function(next) {
    if(this instanceof mongoose.Query) {

        if(Object.keys(this._conditions).length === 0 && this._conditions.constructor === Object) {
            return next();
        }

        let test = /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;

        if(test.test(this._conditions.ip)) {
            return next();
        }

        console.log(this._conditions.ip);
        dns.resolve4(this._conditions.ip, (err, result) => {
            if(result === undefined) {
                return next();
            }

            this._conditions.ip = result[0]; // take first result
            return next();
        });
    }
};

let dnsResolverForSave =  function(next) {
    let test = /^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/;

    if(test.test(this.ip)) {
        return next();
    }

    dns.resolve4(this.ip, (err, result) => {
        if(result === undefined) {
            return next();
        }

        this.ip = result[0]; // take first result
        return next();
    });
};

ServerSchema.pre('find', dnsResolverForFind);
ServerSchema.pre('findOne', dnsResolverForFind);

ServerSchema.pre('save', dnsResolverForSave);

module.exports   = mongoose.model('Server', ServerSchema);