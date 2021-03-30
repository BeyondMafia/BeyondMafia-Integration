const commando = require("discord.js-commando");
const path = require("path");
const dotenv = require("dotenv").config({ path: path.join(__dirname, "../.env") });
const logger = require("../logging")("bot");

(async function () {
	try {
		var bot = new commando.Client({
			owner: "153299118461026304",
			unknownCommandResponse: false,
			intents: ["GUILDS"]
		});
		await bot.login(process.env.BOT_SECRET);

		bot.on("ready", async () => {
			try {
				await bot.guilds.cache.each(async guild => {
					try {
						console.log(guild.name);
						var channel = await guild.channels.cache.find(c => c.type == "text" && c.permissionsFor(guild.me).has("SEND_MESSAGES"));
						var message = `
		**EpicMafia.org is now live!**
		
		Come check out the site as we introduce brand new roles, community features, three new social deception games, and more!
		
		https://epicmafia.org
	
		For future updates about the bot and the site, follow our announcments channel here: https://discord.gg/3B9FPfRJNh
				`;

						if (channel) {
							channel.send(message);
						}
					}
					catch (e) {
						logger.error(e);
					}
				});
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