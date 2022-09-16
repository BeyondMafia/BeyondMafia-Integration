const commando = require("discord.js-commando");
const axios = require("axios");
const global = require("../../components/global");
const utils = require("../../components/utils");
const models = require("../../../db/models");
const logger = require("../../../modules/logging")("bot");
const bot = global.bot;

module.exports = class Leave extends commando.Command {

    constructor(client) {
        super(client, {
            name: "leave",
            group: "game",
            memberName: "leave",
            description: "Leaves your current mafia game",
            examples: ["arc.leave"]
        });
    }

    async run(message, args) {
        try {
            var user = await models.User.findOne({ "accounts.discord.id": message.author.id })
                .select("id");

            if (!user) {
                message.channel.send("There is no ArcMafia account linked to your Discord account. Please sign in with Discord on https://arcmafia.com first.");
                return;
            }

            await axios.post(`${process.env.BASE_URL}/game/leave`, {
                userId: user.id,
                key: process.env.BOT_KEY
            });

            message.channel.send("Left game, use \`arc.mafia\` to create a new one.");
        }
        catch (e) {
            logger.error(e);
        }
    }

}
