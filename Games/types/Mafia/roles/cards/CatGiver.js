const Card = require("../../Card");

module.exports = class CatGiver extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Cat": {
                states: ["Day"],
                flags: ["voting", "noVeg"],
                action: {
                    labels: ["giveItem", "cat"],
                    run: function () {
                        this.target.holdItem("Cat", this.actor);
                        this.target.queueAlert("You have received a cat!");
                    }
                }
            }
        };
    }

}
