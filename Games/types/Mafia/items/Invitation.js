const Item = require("../Item");
const { EXCLUSIVE_PRIORITY_BANQUET } = require("../const/MeetingExclusivePriority");

module.exports = class Invitation extends Item {

    constructor() {
        super("Invitation");

        this.lifespan = 1;

        this.meetings = {
            "Banquet": {
                actionName: "End Meeting?",
                states: ["Night"],
                flags: ["exclusive", "group", "speech", "anonymous", "voting", "mustAct", "noVeg"],
                inputType: "boolean",
                priority: EXCLUSIVE_PRIORITY_BANQUET,
            }
        };

        this.listeners = {
            "meeting": function(meeting) {
                if (meeting.name === "Banquet") {
                    let players = meeting.members.map(a => a.player);
                    let roles = players.map(a => a.role.name);
                    this.game.sendAlert(`You look around the dinner table and see: ${roles.join(", ")}`, [this.holder]);
                }
            }
        };
    }
}
