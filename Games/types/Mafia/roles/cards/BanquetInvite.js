const Card = require("../../Card");
const { PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class BanquetInvite extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Guest 1": {
                states: ["Day"],
                flags: ["voting", "noVeg"],
                targets: { include: ["alive"], exclude: [""] },
                action: {
                    labels: ["giveItem", "Invitation"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function() {
                        if (this.dominates(this.target)) {
                            this.target.holdItem("Invitation");
                        }
                    }
                }
            },
            "Guest 2": {
                states: ["Day"],
                flags: ["voting", "noVeg"],
                targets: { include: ["alive"], exclude: [""] },
                action: {
                    labels: ["giveItem", "Invitation"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function() {
                        if (this.dominates(this.target)) {
                            this.target.holdItem("Invitation");
                        }
                    }
                }
            },
        };
    }

}