const Item = require("../Item");

module.exports = class Invitation extends Item {

    constructor(reveal) {
        super("Invitation");

        this.reveal = reveal;
        this.lifespan = 1;

        this.meetings = {
            "Banquet": {
                actionName: "End Meeting?",
                states: ["Night"],
                flags: ["group", "speech", "anonymous", "voting", "mustAct", "noVeg"],
                inputType: "boolean",
            }
        };

        this.listeners = {
            "meeting": function(meeting) {
                if (meeting.name == "Banquet") {
                    var players = meeting.members.map(a => a.player);
                    let roles = players.map(a => a.role.name);
                    var alert = "You look around the dinner table and see: " + roles.toString();
                    this.game.sendAlert(alert, players);
                }
            }
        };
    }

    shouldDisableMeeting(name, options) {
        var stateInfo = this.game.getStateInfo();

        if (
            stateInfo.name.match(/Night/) &&
            name != "Banquet"
        )
            return true;
    }

}
