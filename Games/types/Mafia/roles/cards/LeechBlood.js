const Card = require("../../Card");
const { PRIORITY_NIGHT_ROLE_BLOCKER } = require("../../const/Priority");

module.exports = class LeechBlood extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Leech": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["block", "blood"],
                    priority: PRIORITY_NIGHT_ROLE_BLOCKER,
                    run: function () {
                        this.actor.role.data.leeched = this.target;
                    }
                },
                shouldMeet() {
                    if (!this.data.leeched){
                        return true;
                    }
                    return !this.data.leeched.alive;
                }
            }
        };

        this.listeners = {
            "state": function (stateInfo) {
                if (!this.leeched){
                    return;
                }

                //this.leeched.data.blood -= 25;
                //this.player.data.blood += 25;

                if (!stateInfo.name.match(/Night/)) {
                    return;
                }

                this.blockActions(this.leeched);
            }
        };
    }
}