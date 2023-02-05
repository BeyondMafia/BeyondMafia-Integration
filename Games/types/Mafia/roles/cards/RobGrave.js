const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class RobGrave extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Rob Grave": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["dead"], exclude: ["alive", "self"] },
                action: {
                    labels: ["stealItem"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        // get role
                        var role = this.target.getAppearance("investigate", true);
                        var alert = `You learn that ${this.target.name}'s role is ${role}.`;
                        this.actor.queueAlert(alert);

                        // steal items
                        var alert2 = `You rob ${this.target.name}'s grave during the night and`;
                        if (this.target.items.length == 0) {
                            alert2 += " found nothing.";
                            this.actor.queueAlert(alert2);
                            return;
                        }

                        let count = {};
                        var numStolenItems = 0;
                        for (let item of this.target.items) {
                            if (item.cannotBeStolen) {
                                continue;
                            }

                            item.drop();
                            item.hold(this.actor);

                            if (item.name in count) {
                                count[item.name] += 1;
                            } else {
                                count[item.name] = 1;
                            }
                            numStolenItems += 1;
                        }

                        if (numStolenItems > 0) {
                            alert2 += ` take ${Object.keys(count).map(key => "a " + key).join(", ")}.`
                        } else {
                            alert2 += " found nothing."
                        }
                        this.actor.queueAlert(`${alert2}`);
                    }
                }
            }
        };
    }

}
