const Item = require("../Item");
const { EXCLUSIVE_PRIORITY_JAIL } = require("../const/MeetingPriority");

module.exports = class Handcuffs extends Item {

    constructor(reveal) {
        super("Handcuffs");

        this.reveal = reveal;
        this.lifespan = 1;
        this.meetings = {
            "Jail": {
                actionName: "Execute Prisoner",
                states: ["Night"],
                flags: ["exclusive", "group", "speech", "voting", "anonymous"],
                inputType: "boolean",
                canVote: false,
                priority: EXCLUSIVE_PRIORITY_JAIL,
            }
        };
    }
}