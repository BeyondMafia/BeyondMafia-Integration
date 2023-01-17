const Card = require("../../Card");
const { PRIORITY_ASSOGUN_GIVER } = require("../../const/Priority");

module.exports = class AssoGunGiver extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Gun": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["Mafia"] },
                action: {
                    labels: ["giveItem", "gun"],
                    priority: PRIORITY_ASSOGUN_GIVER,
                    run: function () {
                        this.target.holdItem("AssoGun");
                        this.target.queueAlert("You have received a gun!");
                    }
                }
            }
        };
    }

}
