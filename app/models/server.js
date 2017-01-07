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
    port:     {
        type:     String,
        required: true
    },
    password: {
        type:     String,
        required: true
    }
});
module.exports   = mongoose.model('Server', ServerSchema);