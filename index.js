const DISCORD = require('discord.js');
const bot = new DISCORD.Client;
const TOKEN = require('./config.json').token;
const PREFIX = require('./config.json').prefix;

/* UTILS */
const logger = require('./util/logging');
const gHelper = require('./helpers/guild-helper');
const arrHelper = require('./helpers/array-helper');

/* CMDS */
const cmdNames = require('./commands/names');



bot.on('ready', () => {
    logger.log('Bot deployed!', logger.SUCCESS);
    logger.log("Status: online", logger.SUCCESS);
    logger.log(`Authors: ${require('./package.json').contributors}`);
    let names = [];
    bot.guilds.cache.forEach(g => {
        names.push(g.name);
    });
    logger.log(`Connected Guilds(${names.length}): [${names}]`);
    logger.log(`Loaded commands: ${arrHelper.toStr(cmdNames)}`);
    logger.log(`Prefix is: ${PREFIX}`);
});




bot.login(TOKEN);