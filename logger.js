'user strict';

const config = require('./config');
const fs = require('fs');

exports.addLog = (log) => {
    fs.appendFile(config.LOGGER_NAME, '\n' + new Date().toISOString() + ': ' + log, function (err) {
        if (err) throw err;
        console.log(log);
    });
}