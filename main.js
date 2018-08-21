'user strict';

const config = require('./config');
const discord = require('discord.js');
const client = new discord.Client();
const scheduleManager = require('./schedulerManager');
const logger = require('./logger');
const dbManager = require('./dbManager');
client.on('ready', () => {
    logger.addLog('Discord Bot started');
    scheduleManager.setDiscord(client); 
});

client.on('message', msg => {
    var commands = msg.content.split(' ');
    if (commands[0] === '!SUB') {
        if(!(config.SUPPORTED_GAMES.includes(commands[1]))){
            msg.reply(commands[1] + ' not supported yet');
            return;
        }
        dbManager.selectChannel({ id: msg.channel.id })
        .then(result => {
            if(result === null) dbManager.insertChannel({
                id: msg.channel.id,
                games: [ commands[1] ]
            });
            else {
                if(result.games.includes(commands[1])){
                    msg.reply('You are already suscribed');
                    return;
                }
                let games = result.games;
                games.push(commands[1]);
                dbManager.updateChannel({ id: msg.channel.id }, { $set: { games: games } });
                msg.reply('Suscribed!!!!');
            }
        });
    }
});

client.login(config.BOT_TOKEN);
