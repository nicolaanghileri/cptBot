/**
 * Returs a pointed list of all the obj properties.
 * 
 * @param {Object} obj the object from which to get properties
 * @param {String} pointerChar the character at the beginning of each line
 */
function getPointedList(obj, pointerChar) {
    if (!pointerChar) { pointerChar = '-'; }
    let out = "";
    for (let prop in obj) {
        out += "   " + pointerChar + obj[prop] + "\n";
    }
    return out;
}

/**
 * Return a members array in a string pointed list
 * 
 * @param {Array} members the members array
 */
function membersToStr(members) {
    let out = "[";
    let len = 0;
    if (!(members instanceof Array)) {
        members = members.array();
    }
    members.forEach(m => {
        if (len == members.length - 1)
            out += m.user.username + "]"
        else
            out += m.user.username + ", "
        len++;
    });
    return out;
}

/**
 * Returns a formatted text representation of a list.
 * 
 * @param {Array} list the list to format
 */
function toStr(list) {
    let out = "[";
    let len = 0;
    for (const e in list) {
        if (len == list.length - 1)
            out += e + "]";
        else
            out += e + ", ";
        len++;
    }
    return out;
}

/**
 * Returns a string representation of an Object.
 * 
 * @param {Object} obj the object from which to get properties
 */
function objToStr(obj) {
    let out = "[";
    let len = 0;
    for (e in obj) {
        if (len == Object.keys(obj).length - 1)
            out += obj[e] + "]";
        else
            out += obj[e] + ", ";
        len++;
    }
    return out;
}

module.exports = {
    getPointedList,
    toStr,
    objToStr,
    membersToStr
};