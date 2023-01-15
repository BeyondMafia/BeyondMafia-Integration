const Card = require("../../Card");
const { PRIORITY_BANQUET_MEETING } = require("../../const/Priority");

module.exports = class BanquetInvite extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Invite A": {
                states: ["Day"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: [] },
                action: {
                    labels: ["giveItem", "Invitation"],
                    priority: PRIORITY_BANQUET_MEETING,
                    run: function() {
                        if (this.dominates()) {
                            this.target.holdItem("Invitation");
                        }
                    }
                }
            },
            "Invite B": {
                states: ["Day"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: [] },
                action: {
                    labels: ["giveItem", "Invitation"],
                    priority: PRIORITY_BANQUET_MEETING,
                    run: function() {
                        if (this.dominates()) {
                            this.target.holdItem("Invitation");
                        }
                    }
                }
            }
        };
    }

}