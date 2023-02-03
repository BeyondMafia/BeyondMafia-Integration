const Item = require("../Item");

module.exports = class Mourned extends Item {

    constructor(reveal) {
        super("Mourned");

        this.lifespan = 1;

        this.meetings = {
            "Mourn": {
				actionName: "Answer Mourner",
                states: ["Night"],
				flags: ["voting"],
                inputType: "boolean",
                canVote: false
            }
        };
    }

    shouldDisableMeeting(name, options) {
        var stateInfo = this.game.getStateInfo();

        if (stateInfo.name.match(/Night/) && name != "Graveyard")
            return true;
    }

}