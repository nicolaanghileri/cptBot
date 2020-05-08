const MSG_SUCCESS = ":white_check_mark:";
const MSG_ERROR = ":x:";
const MSG_WARNING = ":warning:";
const MSG_INFO = ":information_source:";

/**
 * An helper for the guild operations.
 * 
 * @author Ismael Trentin
 * @version 2020.05.08
 */
class GuildHelper {

    constructor() {
        const Logger = require('../util/Logger.js');
        this.logger = new Logger();
        this.msgTypes = { MSG_SUCCESS, MSG_ERROR, MSG_WARNING, MSG_INFO };
    };

    /**
     * Sends a message to the specified channel.
     * 
     * @param {string} content the message content
     * @param {string} type dictates the emoji that will be used before the content, use msgTypes
     * @param {GuildChannel} channel the channel to send the message to 
     */
    async sendMessage(channel, type, content) {
        if (!type) {
            await channel.send(content);
        } else {
            await channel.send(type + " " + content);
        }
    }

    /**
     * Moves the members to the specified channel.
     * 
     * @param {GuildChannel} toChannel the channel to move the members to 
     * @param {Collection<Snowflake, GuildMember>} guildMembers the members to be moved
     */
    async moveMembers(toChannel, guildMembers) {
        await guildMembers.forEach(gm => {
            gm.edit({ channel: toChannel });
        });
    }

    /**
     * Moves the member to the specified channel.
     * 
     * @param {GuildChannel} toChannel the channel to move the members to 
     * @param {GuildMember} guildMembers the member to be moved
     */
    async moveMember(toChannel, guildMember) {
        await guildMember.edit({ channel: toChannel });
    }

    /**
     * Creates a new channel in the guild.
     * 
     * @param {Guild} guild the guild to create the channel to
     * @param {string} name the name of the channel
     * @param {string} _type the type of the channel, text, voice or category
     */
    async createChannel(guild, name, _type) {
        return await guild.channels.create(name, { type: _type })
            .then(channel => {
                return channel;
            })
            .catch(err => {
                this.logger.log(err, this.logger.categories.ERROR);
            });
    }

    /**
     * Creates a text channel based on a voice channel.
     * 
     * @param {Guild} guild the discord server 
     * @param {VoiceChannel} voiceChannel the voice channel name
     */
    async createTextFromVoiceChannel(guild, voiceChannel) {
        let newCh = await guild.channels.create(voiceChannel.name, { type: 'text', permissionOverwrites: voiceChannel.permissionOverwrites })
            .then(channel => {
                return channel;
            })
            .catch(err => this.logger.log(err, this.logger.categories.ERROR));
        this.appendChannelToCategory(newCh, voiceChannel.parent).then(() => { return newCh; });
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
    async createRole(guild, name, color, hoist, mentionable, reason) {
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

    async cloneChannel(channel, newName) {
        let _type = channel.type;
        let perms = channel.permissionOverwrites;
        return await channel.guild.channels.create(newName, { type: _type, permissionOverwrites: perms })
            .then(c => {
                return c;
            })
            .catch(err => {
                this.logger.log(err, this.logger.categories.ERROR);
            });

    }

    async cloneCategory(guild, catName, newName) {
        let channel = guild.channels.cache.find(c => c.name == catName && c.type == 'category');
        let perms;
        if (channel) {
            perms = channel.permissionOverwrites;
        }
        else {
            this.logger.log('No matching category found.', this.logger.categories.ERROR);
            return;
        }
        return await guild.channels.create(newName,
            {
                type: 'category',
                permissionOverwrites: perms
            }).catch(err => {
                this.logger.log('Guild unavailable.', this.logger.categories.ERROR);
            });
    }

    async cloneRole(role, newName) {
        return await role.guild.roles.create(
            {
                data:
                {
                    name: newName,
                    color: role.color,
                    hoist: role.hoist,
                    permissions: role.permissions,
                    mentionable: role.mentionable
                },
                reason: "new role"
            });
    }

    /**
     * Puts a channel in the specified category.
     * 
     * @param {GuildChannel} channel the channel to append
     * @param {CategoryChannel} category the category where the channel is going to be appended
     */
    async appendChannelToCategory(channel, category) {
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
}

module.exports = GuildHelper;