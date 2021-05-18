const Item = require("../Item");

module.exports = class Handcuffs extends Item {

    constructor(reveal) {
        super("Handcuffs");

        this.reveal = reveal;
        this.meetings = {
			"Jail": {
				actionName: "Execute Prisoner",
				states: ["Night"],
				flags: ["group", "speech", "voting", "anonymous"],
				inputType: "boolean",
                canVote: false
			}
        };
    }

    shouldDisableMeeting(name, options) {
        if (name != "Jail")
            return true;
    }

}