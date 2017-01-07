// Load required packages
const mongoose        = require('mongoose');

var RoleSchema = new mongoose.Schema({
    guildid:  {
        type:     String,
        required: true
    },
    roleid:   {
        type:     String,
        unique:   true,
        required: true
    },
    commands: {
        type: Array
    }
});
module.exports = mongoose.model('Role', RoleSchema);