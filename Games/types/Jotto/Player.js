const Player = require("../../core/Player");
const History = require("./History");
const Utils = require("../../core/Utils");
const deathMessages = require("./death");
const logger = require("../../../modules/logging")("games");

module.exports = class JottoPlayer extends Player {

    constructor(user, game, isBot) {
        super(user, game, isBot);
        this.history = new History(this.game, this);
        this.deathMessages = deathMessages;
    }

    socketListeners() {
        const socket = this.socket;

        socket.on("jottovote", word => {
            try {
                if (typeof word != "object") return;

                word.selection = String(word.selection);
                word.meetingId = String(word.meetingId);

                if (!Utils.validProp(word.selection))
                    return;

                if (!Utils.validProp(word.meetingId))
                    return;

                var meeting = this.game.getMeeting(word.meetingId);
                if (!meeting) return;

                meeting.vote(this, word.selection);
            }
            catch (e) {
                logger.error(e);
            }
        });

        super.socketListeners();
    }

    queueDeathMessage(type) {
        const deathMessage = this.deathMessages(type || "basic", this.name);
        this.game.queueAlert(deathMessage);
    }
}