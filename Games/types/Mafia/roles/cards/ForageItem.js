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

                    var items = ["Gun", "Armor", "Knife", "Snowball"]
                    var given_item = items[Math.floor(Math.random() * items.length)];
                    this.actor.holdItem(given_item);

                    switch (given_item) {
                        case "Gun":
                            this.actor.queueAlert("You have received a gun!");
                            break;
                        case "Armor":
                            this.actor.queueAlert("You have received armor!");
                            break;
                        case "Knife":
                            this.actor.queueAlert("You have received a knife!");
                            break;
                        case "Snowball":
                            this.actor.queueAlert("You have received a snowball!");
                            break;
                    }   
                }
            }
        ];
    }
}
