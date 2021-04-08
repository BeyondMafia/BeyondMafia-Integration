const commando = require("discord.js-commando");

var bot = new commando.Client({
    commandPrefix: "arc.",
    owner: "153299118461026304",
    unknownCommandResponse: false,
    intents: ["GUILDS", "GUILD_MESSAGES"]
});

module.exports = {
    bot: bot,
    homeGuild: null,
    roles: {},
    channels: {}
};
