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
var jtor = new Jsonator('./data/students.json', './data/teachers.json', './data/modulez.json');
var gHelper = new GuildHelper();
var lHelper = new ListHelper();

bot.on('ready', () => {
    logger.log('Bot deployed!', logger.categories.SUCCESS);
    logger.log("Status: online", logger.categories.SUCCESS);
    logger.log(`Authors: ${require('./package.json').contributors}`);
    let names = [];
    bot.guilds.cache.forEach(g => {
        names.push(g.name);
    });
    logger.log(`Connected Guilds(${names.length}): ${lHelper.toStr(names)}`);
    logger.log(`Loaded commands: ${lHelper.objToStr(cmdNames)}`);
    logger.log(`Prefix is: ${PREFIX}`);

    /*
    ser.addStudent('dsad', 'sur', 'AA', 2)
        .then((s) => {
            logger.log(`Added new student ${s.name} ${s.surname}.`, logger.categories.SUCCESS);
        })
        .catch(err => {
            logger.log(err, logger.categories.ERROR);
        });
    let te;
    ser.addTeacher('fasdfffsf', 'ffffff')
        .then(t => {
            logger.log(`Added new teacher ${t.name} ${t.surname}.`, logger.categories.SUCCESS);
            ser.addMod('Mod ciao', 2, false, t)
                .then(m => {
                    logger.log(`Added new module ${m.name} - ${m.teacher.surname} ${m.teacher.name}.`, logger.categories.SUCCESS);
                })
                .catch(err => {
                    logger.log(err, logger.categories.ERROR);
                });
        })
        .catch(err => {
            logger.log(err, logger.categories.ERROR);
        });
        

    ser.getModsTeached('Francesco', 'Mussi')
        .then(s => {
            console.log(s);
            //logger.log(`Added new module ${s.name} with teacher ${s.teacher.name} ${s.teacher.surname}`, logger.categories.SUCCESS);
        })
        .catch(err => {
            logger.log(err, logger.categories.ERROR);
        });*/
    jtor.getMod('Mod. 10d5')
        .then(t => {
            console.log(t);
        })
        .catch(err => {
            console.log(err);
        });

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
        case cmdNames.NEW_MODULE:
            break;
    }
});




bot.login(TOKEN);
