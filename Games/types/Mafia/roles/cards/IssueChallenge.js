const Card = require("../../Card");
const { PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class IssueChallenge extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Issue Challenge": {
                states: ["Day"],
                flags: ["voting", "noVeg"],
                targets: { include: ["alive"], exclude: [""] },
                action: {
                    labels: ["giveItem", "Invitation"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function() {
                      this.target.holdItem("Challenge");
                      this.actor.holdItem("Challenge");
                    }
                    }
                }
            },
        };
    }

}
