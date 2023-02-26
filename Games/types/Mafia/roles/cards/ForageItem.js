const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class ForageItem extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                labels: ["giveItem"],
                priority: PRIORITY_ITEM_GIVER_DEFAULT - 1,
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    for (let action of this.game.actions[0])
                        if (action.target == this.actor && !action.hasLabel("hidden"))
                            return;

                    var items = ["Gun", "Armor", "Knife", "Snowball"]
                    var given_item = items[Math.floor(Math.random() * items.length)];
                    switch (given_item) {
                        case "Gun":
                            this.actor.holdItem("Gun");
                            this.actor.queueAlert("You have received a gun!");
                            break;
                        case "Armor":
                            this.actor.holdItem("Armor");
                            this.actor.queueAlert("You have received armor!");
                            break;
                        case "Knife":
                            this.actor.holdItem("Knife");
                            this.actor.queueAlert("You have received a knife!");
                            break;
                        case "Snowball":
                            this.actor.holdItem("Snowball");
                            this.actor.queueAlert("You have received a snowball!");
                            break;
                    }   
                }
            }
        ];
    }
}
