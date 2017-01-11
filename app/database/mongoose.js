const mongoose        = require('mongoose');

var MONGO_DB;
var DOCKER_DB = process.env.DB_PORT;
if (DOCKER_DB) {
    MONGO_DB = DOCKER_DB.replace('tcp', 'mongodb') + '/discord';
} else {
    MONGO_DB = process.env.MONGODB;
}

// mongoose options
var options = {
    db:      {native_parser: true},
    replset: {
        socketOptions: {
            keepAlive: 120
        }
    },
};

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_DB, options);
