const SUCCESS = "SUC";
const INFORMATION = "INF";
const WARNING = "WAR";
const ERROR = "ERR";
const BOT = " BOT ";
const CLIENT = "GUILD";

/**
 * Common logger for logging operations.
 * 
 * @author Ismael Trentin
 * @version 2020.05.07
 */
class Logger {

    arrHelper = require('../helpers/array-helper');

    /**
     * The category or level of a logged operation.
     */
    static categories = { SUCCESS, INFORMATION, WARNING, ERROR };

    /**
     * The side from wich the operation was executed.
     */
    static sides = { BOT, CLIENT };


    constructor() {
        this.types.success = "dsadas";
    }

    /**
     * Improved version of console.log().
     * Constant for side and category are provided in the logging module.
     * 
     * @param {string} msg the log message
     * @param {string} side the side from where the operation was executed. Default is BOT
     * @param {string} category the category of the log. Default is INF
     */
    static log(msg, category, side) {
        if (!side) { side = this.sides.BOT; }
        if (!category) { category = this.categories.INFORMATION; }
        let data = new Date();
        let h = (data.getHours().toString().length == 1) ? "0" + data.getHours() : data.getHours();
        let m = (data.getMinutes().toString().length == 1) ? "0" + data.getMinutes() : data.getMinutes();
        let s = (data.getSeconds().toString().length == 1) ? "0" + data.getSeconds() : data.getSeconds();
        console.log(`[${h}:${m}:${s}][${side}][${category}] ${msg}`);
    }

    /**
     * Logs informations about the cmdName command execution.
     * 
     * @param {User} author the discord message author
     * @param {Object} cmdOutput the command output object
     * @param {string} cmdName the command name
     */
    static logCommand(author, cmdOutput = {}, cmdName, args) {
        let username = author.username;
        let suc = (cmdOutput.success) ? this.categories.SUCCESS : this.categories.ERROR;
        let content;
        if (cmdOutput.success)
            content = `Executed {${cmdName}} successfully with parameters: ${this.arrHelper.toStr(args)}`;
        else
            content = `Exception for {${cmdName}}: ${cmdOutput.cause}`;
        let data = new Date();
        let h = (data.getHours().toString().length == 1) ? "0" + data.getHours() : data.getHours();
        let m = (data.getMinutes().toString().length == 1) ? "0" + data.getMinutes() : data.getMinutes();
        let s = (data.getSeconds().toString().length == 1) ? "0" + data.getSeconds() : data.getSeconds();
        console.log(`[${h}:${m}:${s}][GUILD][${suc}][@${username}] ${content}`);
    }
}

module.exports = Logger;