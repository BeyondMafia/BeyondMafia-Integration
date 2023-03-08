const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class ForageItem extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                labels: ["giveItem"],
                priority: PRIORITY_ITEM_GIVER_DEFAULT,
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    if (this.getVisitors().length > 0) {
                        return;
                    }

                    var items = ["Gun", "Armor", "Knife", "Snowball", "Crystal"]
                    var givenItem = items[Math.floor(Math.random() * items.length)];
                    this.actor.holdItem(givenItem);
                    this.queueGetItemAlert(givenItem, this.actor);
                }
            }
        ];
    }
}
