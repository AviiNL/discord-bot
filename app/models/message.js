// Load required packages
const mongoose        = require('mongoose');

var MessageSchema = new mongoose.Schema({
    guildid:  {
        type:     String,
        required: true
    },
    channelid:   {
        type:     String,
        required: true
    },
    serverid: {
        type: mongoose.Schema.ObjectId
    }
});

module.exports = mongoose.model('Message', MessageSchema);