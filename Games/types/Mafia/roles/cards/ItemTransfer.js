const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class ItemTransfer extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Steal From": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT - 5,
                    run: function () {
                        this.actor.role.data.victim = this.target;
                    }
                }
            },
            "Give To": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        if (typeof this.actor.role.data.victim !== 'undefined')
                            if (this.target.alignment !== "Mafia"){
                                for (let item of this.actor.role.data.victim.items) {
                                    if (item.cannotBeStolen) {
                                        continue;
                                    }

                                    this.target.queueAlert(`You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
                                    item.drop();
                                    item.hold(this.target);
                            }  
                        }
                    }
                }
            }
        };
    }

}
