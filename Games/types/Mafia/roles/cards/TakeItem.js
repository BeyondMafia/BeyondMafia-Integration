const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");
const Random = require("../../../../../lib/Random");

module.exports = class TakeItem extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Steal From": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT + 1,
                    run: function(){
                        let items = Random.randomizeArray(this.target.items);
                        for (let item of items) {
                            if (item.cannotBeStolen) {
                                continue;
                            }

                            this.actor.queueAlert(`You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
                            item.drop();
                            item.hold(this.actor);
                            return;
                        }  
                    }
                }
            },
        }
    }
}
