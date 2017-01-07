// Load required packages
const mongoose        = require('mongoose');

var UserSchema = new mongoose.Schema({
    guildid:  {
        type:     String,
        required: true
    },
    userid:   {
        type:     String,
        unique:   true,
        required: true
    },
    commands: {
        type: Array
    }
});

module.exports = mongoose.model('User', UserSchema);