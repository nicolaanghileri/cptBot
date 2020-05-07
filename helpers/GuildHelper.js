/**
 * An helper the guild operations.
 * 
 * @author Ismael Trentin
 * @version 2020.05.07
 */
class GuildHelper {

    logger = require('../util/Logger');

    constructor() { }

    /**
     * Sends a message to the specified channel.
     * 
     * @param {string} content the message content
     * @param {string} type dictates the emoji that will be used before the content. Use the constants of this module. 
     * @param {GuildChannel} channel the channel to send the message to 
     */
    static async sendMessage(channel, type, content) {
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
    static async moveMembers(toChannel, guildMembers) {
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
    static async moveMember(toChannel, guildMember) {
        await guildMember.edit({ channel: toChannel });
    }

    /**
     * Creates a new channel in the guild.
     * 
     * @param {Guild} guild the guild to create the channel to
     * @param {string} name the name of the channel
     * @param {string} _type the type of the channel, text, voice or category
     */
    static async createChannel(guild, name, _type) {
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
    static async createTextFromVoiceChannel(guild, voiceChannel) {
        let newCh = await guild.channels.create(voiceChannel.name, { type: 'text', permissionOverwrites: voiceChannel.permissionOverwrites })
            .then(channel => {
                return channel;
            })
            .catch(err => this.logger.log(err, this.logger.categories.ERROR));
        this.appendChannelToCategory(newCh, voiceChannel.parent).then(() => { return newCh; });
    }

    static async cloneChannel(channel, newName) {
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

    static async cloneCategory(guild, catName, newName) {
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
    static async createRole(guild, name, color, hoist, mentionable, reason) {
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
    static appendChannelToCategory(channel, category) {
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