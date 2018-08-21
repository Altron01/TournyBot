'user strict';

const rp = require('request-promise');
const cheerio = require('cheerio');
const logger = require('../misc/logger');

exports.fetchTournamentCS2 = () => { 
    return rp({
        uri: 'https://liquipedia.net/starcraft2/Portal:Leagues',
        transform: function (body) {
          return cheerio.load(body);
        }
    }).then($ => {
        let tournaments = [];

        var rows = $('.divRow');
        var tierData = rows.find('.Tournament').find('a');
        var nameData = rows.find('.Tournament').find('b').find('a');
        var dateData = rows.find('.Date');
        var prizeData = rows.find('.Prize');
        var playerNData = rows.find('.PlayerNumber');
        var firstData = rows.find('.FirstPlace').find('span[class=Player]');
        var secondData = rows.find('.SecondPlace').find('span[class=Player]');

        for(let i = 0; i < dateData.length; i++){
            tournaments.push({
                tier: tierData[2*i].children[0].data,
                name: nameData[i].children[0].data,
                date: new Date(dateData[i].children[0].data),
                prize: parseInt(prizeData[i].children[0].data.replace('$', '').replace(',', '').replace('\n', '')),
                playerNumber: parseInt(playerNData[i].children[0].children[0] !== undefined ? playerNData[i].children[0].children[0].data : 0),
                firstPlayer: (firstData[i].children[4] !== undefined ? firstData[i].children[4].children[0].data : 'TBD'),
                secondPlayer: (secondData[i].children[4] !== undefined ? secondData[i].children[4].children[0].data : 'TBD'),
                game: 'SC2'
            });
        }
        return tournaments;
    })
    .catch(err => {
        logger.addLog(err);
    });
};