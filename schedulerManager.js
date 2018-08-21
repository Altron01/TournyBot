'user strict';

const schedule = require('node-schedule');
const dbManager = require('./dbManager');
const tFetcher = require('./tournamentFetcher');
const logger = require('./logger');
const moment = require('moment');
const config = require('./config');

var discordClient;
var schedules = [];

schedule.scheduleJob('* 20 * * *', () => {
    logger.addLog('Schedule Job: Fetch SC2 Tournaments');
    tFetcher.fetchTournamentCS2()
    .then(tournaments => {
        for(let i = 0; i < tournaments.length; i++){
            dbManager.selectTournament(tournaments[i])
            .then(objTournament => {
                if(objTournament === null){
                    dbManager.insertTournament(tournaments[i]);
                }
            });
        }
    })
});

schedule.scheduleJob('* 21 * * *', () => {
    logger.addLog('Schedule Job: Reminder SC2 Tournaments');
    dbManager.selectTournament({})
    .then(objTournaments => {
        for(let i = 0; i < objTournaments.length; i++){
            if(schedules.includes(tournament.name + tournament.date.getDate() + tournament.date.getMonth() + tournament.date.getYear())) continue;
            let currentDate = new Date();
            if(moment(currentDate).isBefore(tournaments[i].date)){
                if(moment(currentDate).isSame(tournaments[i].date, 'month')
                && moment(tournaments[i].date).subtract(currentDate, 'day') > 2){
                    setTournamentSchedule(moment(tournaments[i].date).subtract(5, 'day'), tournaments[i], 'SC2');
                }
                setTournamentSchedule(currentDate, tournaments[i], 'SC2');
            }
        }
    });
});

function setTournamentSchedule(date, tournament, game) {
    let fireTime = '* * ' + (date.getDate()) + ' ' + (date.getMonth() + 1) + ' *';
    schedule.scheduleJob(fireTime, () => {
        dbManager.selectChannelByGame(game)
        .then((channels) => {
            if(channels === null) return;
            for(let i = 0; i < channels.length; i++){
                discordClient.channels.get(channels[i].id).send(tournament.name + 'starts on ' + tournament.date.toDateString() + 'dont miss it!!!');
            }
        });
    });
    schedules.push(tournament.name + tournament.date.getDate() + tournament.date.getMonth() + tournament.date.getYear());
    logger.addLog('Reminder scheduled for month ' + date.getMonth() + ', day ' + (date.getDate() + 1));
};

exports.setTournamentSchedule = setTournamentSchedule;

exports.setDiscord = (discord) => discordClient = discord;