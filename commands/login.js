let year = 0;
let clas = "";
let name = "";
let surname = "";

const filter = (reaction) => {
    return ['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name);
};
const token_filter = (tok) => {
    return true;
}
const name_filter = (name_test) => {
   return true;
}

let teacher_token = ["6c1ccd1f20742182387027bb4b72c4bfe4ca7e9247af5e7c0f1f8ce0f236724e",
    "a648d66730bab91e567a8e229f97f263fd800f59711f4bf634d7c02e9760bf7e",
    "80f563ecc98a3145fc14237415b486396ec6be5e9826ccd0d6ff1686ef2ffc50",
    "a051e62c16c385ab646c4161a67a338bc8e7efdff2c797e53fcdb72b9fc2b4d0",
    "bcbc63c00e153ac759c42189349dcd28aab1bbed05700247748859823796512c",
    "d233633d9524e84c71d6fe45eb3836f8919148e4a5fc2234cc9e6494ec0f11c2",
    "4c8229b4d63cc5c345e154cd6d3374bee6b1d2dbd2665d48f86413a49db21113",
    "d3ef7de562f9a4a34a9a0b05a112955fdecdd0102c3faae5eeb03a195091a5e4",
    "c6afc084dc45355bfff5ccb59f7c611845bb1e61636922abbc6cc650147a6977",
    "8bb5c8106da533c3b4d114534b49a0cddc726410ee16a3992d052d83a7de7df4"];
let student_token = ["b1b94954bb021b6cdbd6cfc53d4ec7b47265ffc6900e434133ae7049b87fb894",
    "6e55ee918da364900705bf2ebd7aaf273bc4743446d0bae11217d022115e7915",
    "53dd3540a657e3c44eb4ff54c6396b065700ccd446abb97126ec1d0ed9743504",
    "e0e2087b3efad83c23c899efb0059a16d9ee9d4ef51349c6066548b8d01f1ab8",
    "cdf30c6b345276278bedc7bcedd9d5582f5b8e0c1dd858f46ef4ea231f92731d",
    "5b42389ef84139ae8643af2a1b369089a3e7298c47e590d18a201b87ebee51e8",
    "da3c059207668b1a430619aa5ae52fa7095c7715bfa120f1245e76495e3079b2",
    "baf33a56f122c46ed390cfe817613af35248a195f0a0177b2c6b53ccac99f54d",
    "522ce7057fd0523adcd6672db24bb671d09d1ffa2f1e7c97c13e6c68ae6fcb13",
    "7932e297e0cec0e1faff4f0e6f8b3b0b0c6ae0823c5c15f69de8534798f82a0b"];

function stringControl(string){
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
function phase1(msg){
    msg.author.send("Per favore incollare la chiave nella chat!")
    .then(message => {
        message.channel.awaitMessages(token_filter, { max: 1, time: 30000, errors: ['token'] })
            .then(collected => {
                const token = collected.first();
                if (student_token.includes(token.toString())) {
                    msg.author.send("Benvenuto, sei un allievo, adesso inserisci i dati necessari!");
                } else if (teacher_token.includes(token.toString())) {
                    msg.author.send("Benvenuto, sei un docente, adesso inserisci i dati necessari!");
                } else {
                    msg.author.send("Per favore inserire un token valido!!, digitare nuovamente in chat -login");
                }
            })
            .catch(collected => {
                msg.author.send("Inserire un token valido (CATCH)");
            })
    });
}
/**
 * The pase2 there are the second and third parameters to be entered by the user, he must enter the name and surname.
 * @param {*} msg the command give by the user.
 */
function phase2(msg){
    msg.author.send("Per favore inserire il tuo Nome")
        .then(name => {
            name.channel.awaitMessages(name_filter, { max: 1, time: 30000, errors: ['name_err'] })
                .then(name => {
                    const NAME = name.first().toString();
                    if(stringControl(NAME)){
                        this.name = NAME;
                        msg.author.send("Nome valido, ora inserire il cognome")
                            .then(surname =>{
                                const SURNAME = surname.first().toString();
                                if(stringControl(SURNAME)){
                                    this.surname = SURNAME;
                                    msg.author.send("Cognome valido!")
                                }else{
                                    msg.author.send("Per favore inserire un cognome valido");
                                }
                            })
                    }else{
                        msg.author.send("Per favore inserire un nome valido");
                    }
                })
        });
}
/**
 * The pase3, here the user must click on the year to which it belongs, based on the discord reactions.
 * @param {*} msg the command give by the user.
 */
function phase3(msg){
    msg.author.send("Per favore clicca sull'anno al quale appartieni:")
    .then(message => {
        message.react('1️⃣').then(() => message.react('2️⃣').then(() =>
            message.react('3️⃣').then(() => message.react('4️⃣').then(() => {
                message.awaitReactions(filter, { max: 1, time: 6000000, errors: ['emoji'] })
                    .then(coll => {
                        const reactions = coll.first();
                        if (reactions.emoji.name === '1️⃣') {
                            year = 1;
                        } else if (reactions.emoji.name === '2️⃣') {
                            year = 2;
                        } else if (reactions.emoji.name === '3️⃣') {
                            year = 3;
                        } else if (reactions.emoji.name === '4️⃣') {
                            year = 4;
                        }
                    })
                    .catch(coll => {
                        console.log(coll);
                    });
            }))));
    });
}
function newUser(msg) {
    
}
module.exports = {
    newUser
}

