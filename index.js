const DISCORD = require('discord.js');
const bot = new DISCORD.Client;
const TOKEN = require('./config.json').token;
const PREFIX = require('./config.json').prefix;
const Logger = require('./util/Logger.js');
const GuildHelper = require('./helpers/GuildHelper.js');
const Jsonator = require('./serialization/Jsonator.js');
const ListHelper = require('./helpers/ListHelper.js');
const ClassReminder = require('./routines/ClassReminder.js');
const cmdNames = require('./commands/names');

//inits
var logger = new Logger();
var jtor = new Jsonator('./data/students.json', './data/teachers.json', './data/modulez.json', './data/timetables/');
var gHelper = new GuildHelper();
var lHelper = new ListHelper();
var reminder = new ClassReminder();

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
    }
});



/* REMINDER ROUTINE */
bot.login(TOKEN);
setInterval(() => {
    let groups = jtor.getGroups();
    groups.forEach(g => {
        jtor.getClassezFor(g)
            .then(cz => {
                cz.forEach(c => {
                    let now = new Date();
                    let h = now.getHours();
                    let m = now.getMinutes();
                    if (h == c.start.h && m == c.start.m - 5) {
                        let channel;
                        channel = bot.guilds.cache.first().channels.resolve(require('./config.json')["reminder-channels"][g]);
                        reminder.remindNextClass(c, channel);
                    }
                });
            });
    });
}, 60000);
