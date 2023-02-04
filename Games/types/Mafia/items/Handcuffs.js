const Item = require("../Item");

module.exports = class Handcuffs extends Item {

    constructor(reveal) {
        super("Handcuffs");

        this.reveal = reveal;
        this.lifespan = 1;
        this.cannotBeStolen = true;
        
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
        var stateInfo = this.game.getStateInfo();

        if (stateInfo.name.match(/Night/) && name != "Jail")
            return true;
    }

}