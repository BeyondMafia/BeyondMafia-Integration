const Card = require("../../Card");
const { PRIORITY_NIGHT_WAITRESS } = require("../../const/Priority");

module.exports = class StealItemsBlock extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Steal From": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_NIGHT_WAITRESS,
                    run: function () {
                        this.blockActions();
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
