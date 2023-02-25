const { validateTestPhoneNumbers } = require("firebase-admin/lib/auth/auth-config");
const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class ItemTransfer extends Card {

    constructor(role) {
        super(role);

        this.actor.role.data.victim = null;
        this.meetings = {
            "Steal From": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
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
                        if (this.target.alignment !== "Mafia"){
                            for (let item of this.actor.role.data.victim.items) {
                                var alert = `You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`
                                this.target.queueAlert(alert)
                                item.drop(this.data.victim);
                                item.hold(this.target);
                            }
                        }
                    }
                }
            }
        };
    }

}
