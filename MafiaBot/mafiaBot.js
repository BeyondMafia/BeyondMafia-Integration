const path = require("path");
const dotenv = require("dotenv").config({ path: path.join(__dirname, "../.env") });
const global = require("./components/global");
const db = require("../db/db");
const listeners = require("./components/listeners");
const periodic = require("./components/periodic");
const logger = require("../logging")("bot");
const bot = global.bot;

bot.registry
    .registerGroups([
        ["game", "Game"],
        ["mod", "Mod"],
        ["misc", "Miscellaneous"]
    ])
    .registerDefaults()
    .registerCommandsIn(__dirname + "/commands");

(async function () {
    try {
        await db.promise;

        //Login with bot and set presence
        await bot.login(process.env.BOT_SECRET);

        bot.on("ready", async () => {
            try {
                await bot.user.setPresence({ 
                    status: "online",
                    activity: { 
                        name: "Use \"arc.mafia\" to play",
                        type: "PLAYING"
                    } 
                });

                //Get references to guild, roles, and channels
                global.homeGuild = await bot.guilds.fetch("458148658987401229");
                global.roles.player = global.homeGuild.roles.cache.find(role => role.name == "Player");
                global.roles.headMod = global.homeGuild.roles.cache.find(role => role.name == "Head Moderator");
                global.roles.serverMod = global.homeGuild.roles.cache.find(role => role.name == "Server Moderator");
                global.roles.admin = global.homeGuild.roles.cache.find(role => role.name == "Admin");
                global.channels.modCommands = global.homeGuild.channels.cache.find(channel => channel.name == "mod-commands");

                //Set up listeners and chron jobs
                listeners();
                periodic();
            }
            catch (e) {
                logger.error(e);
            }
        });
    }
    catch (e) {
        logger.error(e);
    }
})();

process
    .on("unhandledRejection", logger.error)
    .on("uncaughtException", logger.error);