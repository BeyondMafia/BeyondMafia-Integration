const Item = require("../Item");
const {BANQUET_MEETING_PRIORITY} = require("../const/MeetingPriority");

module.exports = class Invitation extends Item {

    constructor() {
        super("Invitation");

        this.lifespan = 1;

        this.meetings = {
            "Banquet": {
                actionName: "End Meeting?",
                states: ["Night"],
                flags: ["group", "speech", "anonymous", "voting", "mustAct", "noVeg"],
                inputType: "boolean",
                exclusive: true,
                priority: BANQUET_MEETING_PRIORITY,
            }
        };

        this.listeners = {
            "meeting": function(meeting) {
                if (meeting.name === "Banquet") {
                    let players = meeting.members.map(a => a.player);
                    let roles = players.map(a => a.role.name);
                    let alert = "You look around the dinner table and see: " + roles.toString();
                    this.game.sendAlert(alert, players);
                }
            }
        };
    }
}
