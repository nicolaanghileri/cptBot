const SUCCESS = "SUC";
const INFORMATION = "INF";
const WARNING = "WAR";
const ERROR = "ERR";
const BOT = " BOT ";
const GUILD = "GUILD";

/**
 * Common logger for logging operations.
 * 
 * @author Ismael Trentin
 * @version 2020.05.08
 */
class Logger {

    constructor() {
        const ListHelper = require('../helpers/ListHelper.js');
        this.lHelper = new ListHelper();
        this.categories = { SUCCESS, INFORMATION, WARNING, ERROR };
        this.sides = { BOT, GUILD };
    }

    /**
     * Improved version of console.log().
     * Constant for side and category are provided in the logging module.
     * 
     * @param {string} msg the log message
     * @param {string} side the side from where the operation was executed. Default is BOT
     * @param {string} category the category of the log. Default is INF
     */
    log(msg, category, side) {
        if (!side) { side = this.sides.BOT; }
        if (!category) { category = this.categories.INFORMATION; }
        let data = new Date();
        let h = (data.getHours().toString().length == 1) ? "0" + data.getHours() : data.getHours();
        let m = (data.getMinutes().toString().length == 1) ? "0" + data.getMinutes() : data.getMinutes();
        let s = (data.getSeconds().toString().length == 1) ? "0" + data.getSeconds() : data.getSeconds();
        console.log(`[${h}:${m}:${s}][${side}][${category}] ${msg}`);
    }

    /**
     * Logs specific informations about a command execution.
     * 
     * @param {User} author the command executor
     * @param {string} cmdName the command name
     * @param {Array} args the command given arguments
     * @param {Object} output the command output object.
     * @param {boolean} output.outcome the command outcome, true positive, false negative.
     * @param {string} output.cause the command error cause if there is one.
     */
    logCommand(author, cmdName, args, output = {}) {
        let username = author.username;
        let content;
        if (output.outcome)
            content = `Executed {${cmdName}} successfully with parameters: ${this.lHelper.toStr(args)}`;
        else
            content = `Exception for {${cmdName}}: ${output.cause}`;
        let data = new Date();
        let h = (data.getHours().toString().length == 1) ? "0" + data.getHours() : data.getHours();
        let m = (data.getMinutes().toString().length == 1) ? "0" + data.getMinutes() : data.getMinutes();
        let s = (data.getSeconds().toString().length == 1) ? "0" + data.getSeconds() : data.getSeconds();
        console.log(`[${h}:${m}:${s}][GUILD][${output.outcome}][@${username}] ${content}`);
    }
}

module.exports = Logger;