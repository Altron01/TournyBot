'use strict';
require('dotenv').config()

const env = (process.argv[2] !== undefined ? process.argv[2] : 'dev');
const dev = {
    DB_ENDPOINT: process.env.DB_ENDPOINT,
    DB_NAME: process.env.DB_NAME,
    LOGGER_NAME: process.env.LOGGER_NAME,
    BOT_TOKEN: process.env.BOT_TOKEN,
    SUPPORTED_GAMES: process.env.SUPPORTED_GAMES.split(','),
    SUPPORTED_COMMANDS: process.env.SUPPORTED_COMMANDS.split(','),
    TYPE: 'dev'
};
const prod = {
    DB_ENDPOINT: process.env.DB_ENDPOINT,
    DB_NAME: process.env.DB_NAME,
    LOGGER_NAME: process.env.LOGGER_NAME,
    BOT_TOKEN: process.env.BOT_TOKEN,
    SUPPORTED_GAMES: process.env.SUPPORTED_GAMES.split(','),
    SUPPORTED_COMMANDS: process.env.SUPPORTED_COMMANDS.split(','),
    TYPE: 'prod'
};

const config = {
    dev,
    prod
};

module.exports = config[env];