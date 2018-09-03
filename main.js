'user strict';

const config = require('./misc/config');
const discord = require('discord.js');
const client = new discord.Client();
const scheduleManager = require('./lib/schedulerManager');
const logger = require('./misc/logger');
const dbManager = require('./lib/dbManager');
client.on('ready', () => {
    logger.addLog('Discord Bot started');
    scheduleManager.setDiscord(client); 
});

function handleSub(msg, middleware){
    var commands = msg.content.split('\s');
    if(!middleware()) return;
    if(!(config.SUPPORTED_GAMES.includes(commands[2]))){
        msg.reply(commands[2] + ' not supported yet :(');
        return;
    }
    dbManager.selectChannel({ id: msg.channel.id })
    .then(result => {
        if(result === null) dbManager.insertChannel({
            id: msg.channel.id,
            games: [ commands[2] ]
        });
        else {
            if(result.games.includes(commands[1])){
                msg.reply('You are already suscribed :p');
                return;
            }
            let games = result.games;
            games.push(commands[2]);
            dbManager.updateChannel({ id: msg.channel.id }, { $set: { games: games } });
            msg.reply('Suscribed!!!! :p');
        }
    });
}

client.on('message', msg => {
    if(!msg.content.includes('Tbot')) return;
    if(msg.guild.ownerID !== msg.author.id) return;
    if (msg.content.includes('sub')) {
        handleSub(msg, () => {
            if(!dbManager.getState()){
                client.users.get(msg.guild.ownerID).send('Hey there was an error pls notify my creator :(');
                return false;
            } else return true;
        });
    }
});

client.login(config.BOT_TOKEN);
