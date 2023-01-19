const Item = require("../Item");
const {JAIL_MEETING_PRIORITY} = require("../const/MeetingPriority");

module.exports = class Handcuffs extends Item {

    constructor(reveal) {
        super("Handcuffs");

        this.reveal = reveal;
        this.lifespan = 1;
        this.meetings = {
            "Jail": {
                actionName: "Execute Prisoner",
                states: ["Night"],
                flags: ["group", "speech", "voting", "anonymous"],
                inputType: "boolean",
                canVote: false,
                exclusive: true,
                priority: JAIL_MEETING_PRIORITY,
            }
        };
    }
}