// Load required packages
const mongoose = require('mongoose');

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
    if(this instanceof mongoose.Query) {
        console.log(this);
        console.log(a);
    }
});



module.exports   = mongoose.model('Server', ServerSchema);