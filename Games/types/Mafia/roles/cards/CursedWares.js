const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class CursedWares extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Cursed Item": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "cursed"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT - 1,
                    run: function() {
                        var itemType = this.actor.role.data.itemType;

                        switch (itemType) {
                            case "Gun":
                                this.target.holdItem("Gun", { cursed: true })
                                this.target.queueAlert(":sy2h: You have received a gun!");
                                break;
                            case "Armor":
                                this.target.holdItem("Armor", { cursed: true })
                                this.target.queueAlert(":sy1a: You have received armor!");
                                break;
                            case "Knife":
                                this.target.holdItem("Knife", { cursed: true })
                                this.target.queueAlert(":sy3h: You have received a knife!");
                                break;
                            case "Snowball":
                                this.target.holdItem("Snowball", { cursed: true })
                                this.target.queueAlert(":sy8b: You have received a snowball!");
                                break;
                            case "Bread":
                                this.target.holdItem("CursedBread")
                                this.target.queueAlert(":sy2c: You have received a piece of bread!");
                                break;
                        }
                        delete this.actor.role.data.itemType;
                    }
                }
            },
            "Choose Cursed Item": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: ["Gun", "Armor", "Knife", "Snowball", "Bread"],
                action: {
                    priority: PRIORITY_ITEM_GIVER_DEFAULT - 2,
                    run: function() {
                        this.actor.role.data.itemType = this.target;
                    }
                }
            },

        };
    }

}