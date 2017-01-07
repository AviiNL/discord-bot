console.log('-'.repeat(25));

require('./database/mongoose');

require('./bootstrap/app');

process.on('uncaughtException', function (error) {
    console.error(error.stack);
});
