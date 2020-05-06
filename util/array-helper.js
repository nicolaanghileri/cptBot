function getPointedList(obj, pointerChar) {
    if (!pointerChar) { pointerChar = '-'; }
    let out = "";
    for (let prop in obj) {
        out += "   " + pointerChar + obj[prop] + "\n";
    }
    return out;
}

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

function toStr(list) {
    let out = "[";
    let len = 0;
    list.forEach(e => {
        if (len == list.length - 1)
            out += e + "]";
        else
            out += e + ", ";
        len++;
    });
    return out;
}

function objToStr(array) {
    let out = "[";
    let len = 0;
    for (e in array) {
        if (len == Object.keys(array).length - 1)
            out += array[e] + "]";
        else
            out += array[e] + ", ";
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