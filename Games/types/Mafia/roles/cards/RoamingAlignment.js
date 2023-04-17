const Card = require("../../Card");
const { PRIORITY_MODIFY_ALIGNMENT, PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class RoamingAlignment extends Card {

    constructor(role) {
        super(role);
        
        this.winCount = "Village";

        this.meetings = {
            "Allign With": {
                actionName: "Follow the ways of",
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_MODIFY_ALIGNMENT,
                    run: function () {
                        let alignment = this.target.role.alignment;
                        if (alignment == "Independent") {
                            this.actor.queueAlert(`You follow ${this.target.name} but could not find somewhere that you could call your own.`)
                            return;
                        }

                        this.actor.role.data.alignment = alignment;
                        this.actor.queueAlert(`You follow ${this.target.name} and learn the ways of the ${alignment}.`);
                    }
                }
            }
        }

        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount, confirmedFinished) {
                if (this.player.alive &&
                    confirmedFinished &&
                    winners.groups[this.data.alignment] &&
                    !winners.groups[this.name]) {
                    winners.addPlayer(this.player, this.name);
                }
            }
        };
        
    }

}
