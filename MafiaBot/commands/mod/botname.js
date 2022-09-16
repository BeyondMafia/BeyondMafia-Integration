const commando = require("discord.js-commando");
const global = require("../../components/global");
const utils = require("../../components/utils");
const logger = require("../../../modules/logging")("bot");
const bot = global.bot;

module.exports = class BotName extends commando.Command {

    constructor(client) {
        super(client, {
            name: "botname",
            group: "mod",
            memberName: "botname",
            description: "Changes the name of the bot",
            examples: ["arc.botname ArcMafia"],
            guildOnly: true,
            args: [
                {
                    key: "name",
                    type: "string",
                    prompt: "What should the bot\"s name be?"
                }
            ]
        });
    }

    hasPermission(message) {
        let perm =
            utils.hasRole(message.member, global.roles.admin) &&
            utils.fromChannel(message, global.channels.modCommands);
        return perm;
    }

    async run(message, args) {
        try {
            await bot.user.setUsername(args.name);
            message.channel.send(`Set username of bot to ${args.name}`);
        }
        catch (e) {
            loggger.error(e);
        }
    }

}
