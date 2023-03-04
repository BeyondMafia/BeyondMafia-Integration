const Card = require("../../Card");
const { PRIORITY_CLEAN_DEATH } = require("../../const/Priority");

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
                    priority: PRIORITY_CLEAN_DEATH,
                    run: function () {
                        this.target.lastWill = null;
                        this.actor.role.data.cleanedHouse = true;
                        for (let item of this.target.items) {
                            if (item.cannotBeStolen) {
                                continue;
                            }

                            this.actor.queueAlert(`You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
                            item.drop();
                            item.hold(this.actor);
                    }
                },
                shouldMeet() {
                    return !this.data.cleanedHouse;
                }
            }
        },
    }
}
}