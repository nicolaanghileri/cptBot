const Jsonator = require('../serialization/Jsonator.js');
let juser = new Jsonator('./data/students.json', './data/teachers.json', './data/modulez.json', './data/timetables/');

let year = 0;
let prof_class = "";
let mat_class = "";
let username = "";
let user_surname = "";
["🅰️","🅱️","🇨"]
const filter = (reaction) => {
    return ['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name);
};
const prof_filter = (reaction) => {
    return ['🅰️','🅱️'].includes(reaction.emoji.name);
};
const mat_filter = (reaction) => {
    return ['🅰️','🅱️','🇨'].includes(reaction.emoji.name);
};
const token_filter = (tok) => {
    return true;
}
const name_filter = (name_test) => {
    return true;
}

let teacher_token = require('../security/tokens.json').t;
let student_token = require('../security/tokens.json').s;

function stringControl(string) {
    var special_chars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!special_chars.test(string)) {
        return true;
    } else {
        return false;
    }
}
/**
 * The phase1 is the first parameter to be entered by the user, he must enter the verification token given by email.
 * @param {*} msg the command give by the user.
 */
async function phase1(msg) {
    return new Promise((resolve, reject) => {
        msg.author.send("Per favore incollare il token nella chat!")
            .then(message => {
                message.channel.awaitMessages(token_filter, { max: 1, time: 30000, errors: ['token'] })
                    .then(collected => {
                        const token = collected.first();
                        if (student_token.includes(token.toString())) {
                            msg.author.send("Benvenuto, sei un allievo, adesso inserisci i dati necessari!");
                            resolve(1);
                            return;
                        } else if (teacher_token.includes(token.toString())) {
                            msg.author.send("Benvenuto, sei un docente, adesso inserisci i dati necessari!");
                            resolve(2);
                            return;
                        } else {
                            msg.author.send("Per favore inserire un token valido!!");
                            reject(0);
                            return;
                        }
                    })
                    .catch(collected => {
                        console.log(collected);
                    });
            })
    });
}

/**
 * The pase2 there are the second and third parameters to be entered by the user, he must enter the name and surname.
 * @param {*} msg the command give by the user.
 */
async function phase2(msg) {
    return new Promise((resolve, reject) => {
        msg.author.send("Per favore inserire il tuo Nome")
            .then(name => {
                name.channel.awaitMessages(name_filter, { max: 1, time: 30000, errors: ['name_err'] })
                    .then(namee => {
                        const NAME = namee.first().toString();
                        if (stringControl(NAME)) {
                            username = NAME;
                            msg.author.send("Nome valido, ora inserire il cognome")
                                .then(surname => {
                                    surname.channel.awaitMessages(name_filter, { max: 1, time: 30000, errors: ['sur_err'] })
                                        .then(surnamee => {
                                            const SURNAME = surnamee.first().toString();
                                            if (stringControl(SURNAME)) {
                                                user_surname = SURNAME;
                                                msg.author.send("Cognome valido!")
                                                resolve(true);
                                                return;
                                            } else {
                                                msg.author.send("Per favore inserire un Cognome valido");
                                                reject(true);
                                                return;
                                            }
                                        })
                                });
                        } else {
                            msg.author.send("Per favore inserire un Nome valido");
                            reject(true);
                        }
                    })
            })
    });
}
/**
 * The pase3, here the user must click on the year to which it belongs, based on the discord reactions.
 * @param {*} msg the command give by the user.
 */
async function phase3(msg) {
    return new Promise((resolve, reject) => {
        msg.author.send("Per favore clicca sull'anno al quale appartieni:")
            .then(message => {
                message.react('1️⃣').then(() => message.react('2️⃣').then(() =>
                    message.react('3️⃣').then(() => message.react('4️⃣').then(() => {
                        message.awaitReactions(filter, { max: 1, time: 30000, errors: ['emoji'] })
                            .then(coll => {
                                const reactions = coll.first();
                                if (reactions.emoji.name === '1️⃣') {
                                    year = 1;
                                    resolve(true);
                                    return;
                                } else if (reactions.emoji.name === '2️⃣') {
                                    year = 2;
                                    resolve(true);
                                    return;
                                } else if (reactions.emoji.name === '3️⃣') {
                                    year = 3;
                                    resolve(true);
                                    return;
                                } else if (reactions.emoji.name === '4️⃣') {
                                    year = 4;
                                    resolve(true);
                                    return;
                                }
                            })
                            .catch(coll => {
                                console.log(coll);
                                reject(true);
                            });
                    }))));
            })
    });
}

/**
 * Phase 4, the user must to insert in witch professional class he is.
 * @param {*} msg the command give by the user.
 */
async function phase4(msg) {
    return new Promise((resolve, reject) => {
        msg.author.send("Per favore clicca sulla classe di professionale che frequenti: \n Es:I2AC, A è la classe di professionale, C è la calsse di maturità")
            .then(message => {
                message.react("🅰️").then(() => message.react('🅱️').then(() => {
                    message.awaitReactions(prof_filter, { max: 1, time: 30000, errors: ['emojii'] })
                        .then(coll => {
                            const reactions = coll.first();
                            if (reactions.emoji.name === '🅰️') {
                                prof_class = "A";
                                resolve(true);
                                return;
                            } else if (reactions.emoji.name === '🅱️') {
                                prof_class = "B";
                                resolve(true);
                                return;
                            }
                        })
                        .catch(coll => {
                            console.log(coll);
                            reject(true);
                        });
                }));
            })
    });
}
/**
 * Phase 5, the user must to insert in witch maturità class he is.
 * @param {*} msg 
 */
async function phase5(msg) {
    return new Promise((resolve, reject) => {
        msg.author.send("Per favore clicca sulla classe di maturità che frequenti:")
            .then(message => {
                message.react('🅰️').then(() => message.react('🅱️').then(() =>
                    message.react('🇨').then(() => {
                        message.awaitReactions(mat_filter, { max: 1, time: 30000, errors: ['emojis'] })
                            .then(coll => {
                                const reactions = coll.first();
                                if (reactions.emoji.name === '🅰️') {
                                    mat_class = "A";
                                    resolve(true);
                                    return;
                                } else if (reactions.emoji.name === '🅱️') {
                                    mat_class = "B";
                                    resolve(true);
                                    return;
                                } else if (reactions.emoji.name === '🇨') {
                                    mat_class = "C";
                                    resolve(true);
                                    return;
                                }
                            })
                            .catch(coll => {
                                console.log(coll);
                                reject(true);
                            });
                    })));
            })
    });
}
async function newUser(msg) {
    let user_type = 0;
    let infos_test = false;
    let year_test = false;
    let mat_test = false;
    let prof_test = false;
    do {
        await phase1(msg)
            .then(test => {
                user_type = test;
            })
            .catch(test => {
                console.log(test);
            });
        msg.author.send(user_type);
    } while (user_type == 0);
    if (user_type == 2) {
        do {
            await phase2(msg)
                .then(test => {
                    infos_test = true;
                })
                .catch(test2 => {
                    infos_test = false;
                });
        } while (!infos_test);
        msg.author.send('Login finito docente');
        console.log(username);
        console.log(user_surname);
        juser.addTeacher(username,user_surname);
    } else {
        do {
            await phase2(msg)
                .then(test => {
                    infos_test = true;
                })
                .catch(test2 => {
                    infos_test = false;
                });
        } while (!infos_test);
        msg.author.send('fase 2 studente finita');
        do {
            await phase3(msg)
                .then(test1 => {
                    year_test = true;
                })
                .catch(test1 => {
                    year_test = false;
                });
        } while (!year_test);
        msg.author.send('fase 3 studente finita');
        do {
            await phase4(msg)
                .then(test2 => {
                    prof_test = true;
                    console.log("1");
                })
                .catch(test2 => {
                    prof_test = false;
                });
        } while (!prof_test);
        msg.author.send('fase 4 studente finita');
        do {
            await phase5(msg)
                .then(test3 => {
                    mat_test = true;
                    console.log("11");
                })
                .catch(test3 => {
                    mat_test = false;
                });
        } while (!mat_test);
        msg.author.send('fase 5 studente finita');
        let group = prof_class + mat_class;
        juser.addStudent(username,user_surname,group,year,msg.author.id);
    }
}
module.exports = {
    newUser
}

