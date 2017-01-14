// Load required packages
const mongoose = require('mongoose');
const util = require('util');

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


ServerSchema.pre('find', function(a) {
    console.log("====== find ======");
    if(this instanceof mongoose.Query) {
        console.log(util.inspect(this, { showHidden: true, depth: null }));
        //console.log(a);
    }
});

ServerSchema.pre('findOne', function(a) {
    console.log("====== findOne ======");
    if(this instanceof mongoose.Query) {
        console.log(util.inspect(this, { showHidden: true, depth: null }));
        //console.log(a);
    }
});


module.exports   = mongoose.model('Server', ServerSchema);