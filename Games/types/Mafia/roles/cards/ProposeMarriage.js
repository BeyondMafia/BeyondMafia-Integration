const Card = require("../../Card");

module.exports = class ProposeMarriage extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Propose": {
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                shouldMeet: function() {
                    return !this.data.isMarried;
                },
                action: {
                    labels: ["marriage"],
                    run: function () {
                        this.game.queueAlert(`Someone proposes to ${this.target.name}.`);
                        
                        let meetingName = "Accept Proposal from " + this.actor.name;
                        let ring = this.target.holdItem("WeddingRing", this.actor, meetingName);
                        this.game.instantMeeting(ring.meetings, [this.target]);
                    }
                },
            }
        };
    }

}
