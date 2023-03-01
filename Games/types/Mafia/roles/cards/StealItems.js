const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class StealItems extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Steal From": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT - 50,
                    run: function () {
                        for (let item of this.target.items) {
                            if (item.cannotBeStolen) {
                                continue;
                            }

                            this.actor.queueAlert(`You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
                            item.drop();
                            item.hold(this.actor);
                        }
                    }
                }
            },
        }
    }
}
