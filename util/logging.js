const SUCCESS = "SUC";
const INFORMATION = "INF";
const WARNING = "WAR";
const ERROR = "ERR";

const BOT = " BOT ";
const CLIENT = "GUILD"

/**
 * Improved version of console.log().
 * Constant for side and category are provided in the logging module.
 * 
 * @param {string} msg the log message
 * @param {string} side the side from where the operation was executed. Default is BOT
 * @param {string} category the category of the log. Default is INF
 */
function log(msg, category, side) {
    if (!side) { side = BOT; }
    if (!category) { category = INFORMATION; }
    let data = new Date();
    let h = (data.getHours().toString().length == 1) ? "0" + data.getHours() : data.getHours();
    let m = (data.getMinutes().toString().length == 1) ? "0" + data.getMinutes() : data.getMinutes();
    let s = (data.getSeconds().toString().length == 1) ? "0" + data.getSeconds() : data.getSeconds();
    console.log(`[${h}:${m}:${s}][${side}][${category}] ${msg}`);
}


module.exports = {
    log,
    BOT,
    CLIENT,
    SUCCESS,
    INFORMATION,
    WARNING,
    ERROR
};