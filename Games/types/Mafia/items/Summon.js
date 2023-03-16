const { MEETING_PRIORITY_SEANCE } = require("../const/MeetingPriority");
const Item = require("../Item");

module.exports = class Summon extends Item {

    constructor(meetingName) {
        super("Summon");

        this.lifespan = 1;
        this.meetingName = meetingName;
        this.meetings[meetingName] = {
            meetingName: "Seance",
            actionName: "End Meeting?",
            states: ["Night"],
            flags: ["exclusive", "group", "speech", "anonymous", "voting"],
            priority: MEETING_PRIORITY_SEANCE,
            isVoter: false,
            whileDead: true
        }
    };
}