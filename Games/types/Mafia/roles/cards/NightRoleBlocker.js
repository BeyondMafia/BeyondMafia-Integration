const Card = require("../../Card");
const { PRIORITY_NIGHT_ROLE_BLOCKER } = require("../../const/Priority");

module.exports = class NightRoleBlocker extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Block": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["block"],
                    priority: PRIORITY_NIGHT_ROLE_BLOCKER,
                    run: function () {
                        this.roleblockTarget();
                    }
                }
            }
        };
    }
}