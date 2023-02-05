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
                    labels: ["giveItem"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        // get role
                        var role = this.target.getAppearance("investigate", true);
                        var alert = `You learn that ${this.target.name}'s role is ${role}.`;
                        this.actor.queueAlert(alert);
                        // steal items
                        let items = this.target.items.map(a => a.name);
                        let alert2 = `You rob ${this.target.name}'s grave during the night and take `;

                        if (items.length) {
                            let count = {};

                            for (let item of items) {
                                item.hold(this.actor);
                                //this.target.dropItem(item, true);
                                if (item.name in count) {
                                    count[item.name] += 1;
                                }
                                else {
                                    count[item.name] = 1;
                                }
                            }

                            alert2 += Object.keys(count).map(key => "a " + key).join(", ") + ".";
                        } else {
                            alert2 += "nothing.";
                        }

                        this.actor.queueAlert(`${alert2} which they were carrying.`);
                    }
                }
            }
        };
    }

}
