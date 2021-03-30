const global = require("./global");
const models = require("../../db/models");
const logger = require("../../logging")("bot");
const bot = global.bot;

module.exports = function () {
    bot.on("guildCreate", function (guild) {
        try {
            var channel = guild.channels.cache.find(c => c.type == "text" && c.permissionsFor(guild.me).has("SEND_MESSAGES"));
            var joinMessage = `
**Thanks for adding ArcMafia!**

You're now able to create and play games with \`arc.mafia\`. For more commands, use \`arc.help\`.

For questions or comments regarding the site/server, please reach out to rend#7904.
        `;

            if (channel)
                channel.send(joinMessage);
        }
        catch (e) {
            logger.error(e);
        }
    });
};
