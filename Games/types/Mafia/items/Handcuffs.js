const Item = require("../Item");

module.exports = class Handcuffs extends Item {

    constructor(reveal) {
        super("Handcuffs");

        this.reveal = reveal;
        this.lifespan = 1;
        this.meetings = {
            "Jail": {
                actionName: "Execute Prisoner",
                states: [STATE_NIGHT],
                flags: [FLAG_GROUP, FLAG_SPEECH, FLAG_VOTING, FLAG_ANONYMOUS],
                inputType: "boolean",
                canVote: false
            }
        };
    }

    shouldDisableMeeting(name, options) {
        var stateInfo = this.game.getStateInfo();

        if (stateInfo.name.match(/Night/) && name != "Jail")
            return true;
    }

}
