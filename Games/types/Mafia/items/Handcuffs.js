const Item = require("../Item");
const { MEETING_PRIORITY_JAIL } = require("../const/MeetingPriority");

module.exports = class Handcuffs extends Item {

    constructor(meetingName) {
        super("Handcuffs");

        this.meetingName = meetingName;
        this.lifespan = 1;
        this.cannotBeStolen = true;
        this.meetings[meetingName] = {
            meetingName: "Jail",
            actionName: "Execute Prisoner",
            states: ["Night"],
            flags: ["exclusive", "group", "speech", "voting", "anonymous"],
            inputType: "boolean",
            canVote: false,
            priority: MEETING_PRIORITY_JAIL,
        };
    }
}