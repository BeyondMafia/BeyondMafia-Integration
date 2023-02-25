const Item = require("../Item");

module.exports = class Summon extends Item {

    constructor(reveal) {
        super("Summon");

        this.reveal = reveal;
        this.lifespan = 1;
        this.meetings = {
            "Seance": {
                actionName: "End Seance",
                states: ["Night"],
                flags: ["group", "speech", "voting"],
                whileDead: true,
                passiveDead: false,
                inputType: "boolean",
                canVote: true,
                },
            }
        };

    shouldDisableMeeting(name, options) {
        var stateInfo = this.game.getStateInfo();

        if (stateInfo.name.match(/Night/) && name != "Seance")
            return true;
    }

}