const Card = require("../../Card");

module.exports = class BroadcastMessage extends Card {

    constructor(role) {
        super(role);
    }

    speak(message) {
        if (message.abilityName != "Cry")
            return;

        message.modified = true;
        message.anonymous = true;
        message.quotable = false;
        message.prefix = "cries out";
        message.recipients = message.game.players;
    }
}
