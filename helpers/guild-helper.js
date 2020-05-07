const logger = require('../util/logging');

const MSG_SUCCESS = ":white_check_mark:";
const MSG_ERROR = ":x:";
const MSG_WARNING = ":warning:";
const MSG_INFO = ":information_source:";

/**
 * Sends a message to the specified channel.
 * 
 * @param {string} content the message content
 * @param {string} type dictates the emoji that will be used before the content. Use the constants of this module. 
 * @param {GuildChannel} channel the channel to send the message to 
 */
function sendMessage(content, type, channel) {
    if (!type) {
        channel.send(content);
    } else {
        channel.send(type + " " + content);
    }
}

/**
 * Moves the members to the specified channel.
 * 
 * @param {GuildChannel} toChannel the channel to move the members to 
 * @param {Collection<Snowflake, GuildMember>} guildMembers the members to be moved
 */
function moveMembers(toChannel, guildMembers) {
    guildMembers.forEach(gm => {
        gm.edit({ channel: toChannel });
    });
}

/**
 * Moves the member to the specified channel.
 * 
 * @param {GuildChannel} toChannel the channel to move the members to 
 * @param {GuildMember} guildMembers the member to be moved
 */
function moveMember(toChannel, guildMember) {
    guildMember.edit({ channel: toChannel });
}

/**
 * Creates a new channel in the guild.
 * 
 * @param {Guild} guild the guild to create the channel to
 * @param {string} name the name of the channel
 * @param {string} _type the type of the channel, text, voice or category
 */
async function createChannel(guild, name, _type) {
    return await guild.channels.create(name, { type: _type })
        .then(channel => {
            return channel;
        })
        .catch(err => logger.log(err, logger.ERROR));
}

async function cloneChannel(channel, newName) {
    let _type = channel.type;
    let perms = channel.permissionOverwrites;
    await channel.guild.channels.create(newName,
        {
            type: _type,
            permissionOverwrites: perms
        });
}

async function cloneCategory(guild, catName, newName) {
    let channel = guild.channels.cache.find(c => c.name == catName && c.type == 'category');
    let perms;
    if (channel) {
        perms = channel.permissionOverwrites;
    }
    else {
        return { newcat: null, success: false, cause: 'No matching category found.' };
    }
    let newC = await guild.channels.create(newName,
        {
            type: 'category',
            permissionOverwrites: perms
        }).catch(err => {
            logger.log('Guild unavailable.', logger.ERROR);
        });
    return { newcat: newC, success: true, cause: null };
}

/**
 * Creates a new role in the guild.
 * 
 * @param {Guild} guild the guild to create the role to
 * @param {string} name the name of the role
 * @param {string} color the color of the role
 * @param {boolean} hoist dictates if the users having this role should be separeted in the guild's user list 
 * @param {boolean} mentionable dictates if the user is mentionable
 * @param {string} reason the reason for the role creation
 */
async function createRole(guild, name, color, hoist, mentionable, reason) {
    return await guild.roles.create(
        {
            data:
            {
                name: name,
                color: color,
                hoist: hoist,
                mentionable: mentionable
            },
            reason: reason
        });
}

/**
 * Puts a channel in the specified category.
 * 
 * @param {GuildChannel} channel the channel to append
 * @param {CategoryChannel} category the category where the channel is going to be appended
 */
function appendChannelToCategory(channel, category) {
    return new Promise((resolve, reject) => {
        /*let category = channel.guild.channels.cache.find(c => c.name == categoryName && c.type == "category");
        if (!category) {
            //throw new Error("Category <" + categoryName + "> does not exist!");
            reject("Category <" + categoryName + "> does not exist!");
        }*/
        channel.setParent(category.id);
        resolve();
    });
}

module.exports = {
    sendMessage,
    moveMembers,
    moveMember,
    createChannel,
    cloneChannel,
    cloneCategory,
    createRole,
    appendChannelToCategory,
    MSG_SUCCESS,
    MSG_INFO,
    MSG_ERROR,
    MSG_WARNING
};