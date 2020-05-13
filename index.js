const DISCORD = require('discord.js');
const bot = new DISCORD.Client;
const TOKEN = require('./config.json').token;
const PREFIX = require('./config.json').prefix;
const Logger = require('./util/Logger.js');
const GuildHelper = require('./helpers/GuildHelper.js');
const Jsonator = require('./serialization/Jsonator.js');
const ListHelper = require('./helpers/ListHelper.js');
const cmdNames = require('./commands/names');

//inits
var logger = new Logger();
var jtor = new Jsonator('./data/students.json', './data/teachers.json', './data/modulez.json', './data/timetables/');
var gHelper = new GuildHelper();
var lHelper = new ListHelper();

bot.on('ready', () => {
    logger.log('Bot deployed!', logger.categories.SUCCESS);
    logger.log("Status: online", logger.categories.SUCCESS);
    logger.log(`Version: ${require('./package.json').version}`);
    logger.log(`Authors: ${require('./package.json').contributors}`);
    let names = [];
    bot.guilds.cache.forEach(g => {
        names.push(g.name);
    });
    logger.log(`Connected Guilds(${names.length}): ${lHelper.toStr(names)}`);
    logger.log(`Loaded commands: ${lHelper.objToStr(cmdNames)}`);
    logger.log(`Prefix is: ${PREFIX}`);
});

bot.on('message', msg => {
    if (!msg.content.startsWith(PREFIX)) return;
    let args = msg.content.substring(PREFIX.length).split(" ");
    let cmd = args[0];                 //Il nome del comando.
    args = args.slice(1, args.length); //Gli argomenti del comando.

    switch (cmd) {
        case cmdNames.TEST:
            break;
        case cmdNames.NEW_TEACHER:
            break;
        case cmdNames.NEW_STUDENT:
            break;
        case cmdNames.NEW_MODULE:
            break;
    }
});

bot.login(TOKEN);
