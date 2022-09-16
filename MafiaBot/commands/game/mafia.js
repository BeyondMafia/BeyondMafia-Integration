const commando = require("discord.js-commando");
const axios = require("axios");
const global = require("../../components/global");
const models = require("../../../db/models");
const logger = require("../../../modules/logging")("bot");
const bot = global.bot;

module.exports = class Mafia extends commando.Command {

    constructor(client) {
        super(client, {
            name: "mafia",
            group: "game",
            memberName: "mafia",
            description: "Creates a new mafia game",
            examples: ["arc.mafia", "arc.mafia SETUP_NAME"],
            args: [
                {
                    key: "setup",
                    type: "string",
                    prompt: "What setup do you want to play?",
                    default: ""
                }
            ]
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

            var setup;

            if (!args.setup)
                setup = await models.Setup.find().sort("-played").limit(1);
            else
                setup = await models.Setup.find({ name: { $regex: args.setup, $options: "i" } }).limit(1);

            if (!setup || setup.length == 0) {
                message.channel.send("Setup not found.");
                return;
            }
            else
                setup = setup[0].id;

            try {
                var res = await axios.post(`${process.env.BASE_URL}/game/host`, {
                    userId: user.id,
                    setup: setup,
                    private: true,
                    gameType: "Mafia",
                    key: process.env.BOT_KEY
                });

                var gameId = res.data;
                message.channel.send(`Game created: ${process.env.BASE_URL}/game/${gameId}`);
            }
            catch (e) {
                if (e.response && e.response.data)
                    message.channel.send(e.response.data);
                else
                    message.channel.send(e.message);
            }
        }
        catch (e) {
            logger.error(e);
        }
    }

}
