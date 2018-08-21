'user strict';

const mongo = require('mongodb').MongoClient;
const config = require('../misc/config');
const logger = require('../misc/logger');

var db;

console.log(config);
mongo.connect(config.DB_ENDPOINT, { useNewUrlParser: true }, (err, client) => {
    if(err) logger.addLog(err.stack);
    else {
        logger.addLog('Database Init Succesful');
        db = client.db(config.DB_NAME);
    }
});

exports.selectTournament = (tournament) => {
    return new Promise((resolve, reject) => {
        db.collection('tournaments').findOne(tournament, (err, result) => {
            if(err) reject(err);
            else{
                logger.addLog('Selected: ' + result);
                resolve(result);
            }
        })
    })
    .catch((err) => {
        logger.addLog(err);
    });
};

exports.insertTournament = (tournament) => {
    return new Promise((resolve, reject) => {
        db.collection('tournaments').insert(tournament, (err, result) => {
            if(err) reject(err); 
            else{
                logger.addLog('Inserted: ' + tournament);
                resolve(result);
            }
        });
    })
    .catch((err) => {
        logger.addLog(err);
    });
};

exports.selectChannel = (channel) => {
    return new Promise((resolve, reject) => {
        db.collection('channels').findOne(channel, (err, result) => {
            if(err) reject(err); 
            else{
                logger.addLog('Selected: ' + result);
                resolve(result);
            }
        });
    })
    .catch((err) => {
        logger.addLog(err);
    });
};

exports.selectChannelByGame = (game) => {
    return new Promise((resolve, reject) => {
        db.collection('channels').find({}).toArray((err, result) => {
            if(err) reject(err); 
            else{
                let res = [];
                for(let i = 0; i < result.length; i++){
                    if(result[i].games.includes(game)) res.push(result[i]);
                }
                resolve(res);
                logger.addLog('Selected: ' + res);
            }
        });
    })
    .catch((err) => {
        logger.addLog(err);
    });
};

exports.insertChannel = (channel) => {
    return new Promise((resolve, reject) => {
        db.collection('channels').insertOne(channel, (err, result) => {
            if(err) reject(err);
            else{
                logger.addLog('Inserted: ' + channel);
                resolve(result);
            }
        });
    })
    .catch((err) => {
        logger.addLog(err);
    });
};

exports.deleteChannel = (channel) => {
    return new Promise((resolve, reject) => {
    })
    .catch((err) => {
        logger.addLog(err);
    });
};

exports.updateChannel = (channel, newChannel) => {
    return new Promise((resolve, reject) => {
        db.collection('channels').updateOne(channel, newChannel, (err, result) => {
            if(err) reject(err); 
            else{
                logger.addLog('Updated from: ' + channel + ' to ' + newChannel);
                resolve(result);
            }
        });
    })
    .catch((err) => {
        logger.addLog(err);
    });
};