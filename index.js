const DISCORD = require('discord.js');
const bot = new DISCORD.Client;
const TOKEN = require('./config.json').token;
const PREFIX = require('./config.json').prefix;

/* UTILS */
const logger = require('./util/Logger');
const gHelper = require('./helpers/GuildHelper');
const arrHelper = require('./helpers/ListHelper');
const Serializer = require('./serialization/Serializer.js');
var ser;

/* CMDS */
const cmdNames = require('./commands/names');



bot.on('ready', () => {
    logger.log('Bot deployed!', logger.categories.SUCCESS);
    logger.log("Status: online", logger.categories.SUCCESS);
    logger.log(`Authors: ${require('./package.json').contributors}`);
    let names = [];
    bot.guilds.cache.forEach(g => {
        names.push(g.name);
    });
    logger.log(`Connected Guilds(${names.length}): ${arrHelper.toStr(names)}`);
    logger.log(`Loaded commands: ${arrHelper.objToStr(cmdNames)}`);
    logger.log(`Prefix is: ${PREFIX}`);
    ser = new Serializer('./data/students.json', './data/teachers.json', './data/modulez.json');
    ser.addStudent('dsad', 'sur', 'AA', 2);
    ser.addTeacher('fasdfffsf', 'ffffff');
});

bot.on('message', msg => {
    if (!msg.content.startsWith(PREFIX)) return;
    let args = msg.content.substring(PREFIX.length).split(" ");
    let cmd = args[0];                 //Il nome del comando.
    args = args.slice(1, args.length); //Gli argomenti del comando.

    switch (cmd) {
        case cmdNames.TEST:
            /*    
            gHelper.cloneCategory(msg.guild, args[0], args[1]);
            let cat = msg.channel.parent;
            cat.children.forEach(c => {
                if(c.type === 'voice')
                    gHelper.createTextFromVoiceChannel(msg.guild, c);
            });*/
            break;
        case cmdNames.NEW_TEACHER:
            break;
        case cmdNames.NEW_STUDENT:
            break;
    }
});




bot.login(TOKEN);
