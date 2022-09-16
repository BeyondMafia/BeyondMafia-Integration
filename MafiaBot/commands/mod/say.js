const commando = require("discord.js-commando");
const global = require("../../components/global");
const utils = require("../../components/utils");
const logger = require("../../../modules/logging")("bot");
const bot = global.bot;

module.exports = class BotSpeak extends commando.Command {

    constructor(client) {
        super(client, {
            name: "say",
            group: "mod",
            memberName: "say",
            description: "Sends a message as the bot",
            examples: ["arc.say hello from the bot"],
            guildOnly: true,
            args: [
                {
                    key: "message",
                    type: "string",
                    prompt: "What would you like the bot to say?"
                }
            ]
        });
    }

    hasPermission(message) {
        let perm =
            (
                utils.hasRole(message.member, global.roles.headMod) ||
                utils.hasRole(message.member, global.roles.admin)
            ) &&
            utils.fromChannel(message, global.channels.modCommands);
        return perm;
    }

    async run(message, args) {
        try {
            await message.delete();
            message.channel.send(args.message);
        }
        catch (e) {
            logger.error(e);
        }
    }

}
