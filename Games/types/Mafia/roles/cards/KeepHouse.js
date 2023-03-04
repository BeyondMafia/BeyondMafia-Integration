const Card = require("../../Card");
const { PRIORITY_ITEM_TAKER_DEFAULT } = require("../../const/Priority");

module.exports = class KeepHouse extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Housekeep": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_ITEM_TAKER_DEFAULT,
                    run: function () {
                        this.target.lastWill = null;
                        this.actor.role.data.cleanedHouse = true;
                        this.stealAllItems();
                    },
                    shouldMeet() {
                        return !this.data.cleanedHouse;
                    }
                }
            },
        }
    }
}