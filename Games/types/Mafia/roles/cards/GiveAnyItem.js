const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class GiveAnyItem extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Item": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "cursed"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT - 1,
                    run: function() {
                        var itemType = this.actor.role.data.itemType;

                        switch (itemType) {
                            case "Gun":
                                this.target.holdItem("Gun")
                                this.target.queueAlert(":sy2h: You have received a gun!");
                                break;
                            case "Armor":
                                this.target.holdItem("Armor")
                                this.target.queueAlert(":sy1a: You have received armor!");
                                break;
                            case "Knife":
                                this.target.holdItem("Knife")
                                this.target.queueAlert(":sy3h: You have received a knife!");
                                break;
                            case "Snowball":
                                this.target.holdItem("Snowball")
                                this.target.queueAlert(":sy8b: You have received a snowball!");
                                break;
                            case "Bread":
                                this.target.holdItem("Bread")
                                this.target.queueAlert(":sy2c: You have received a piece of bread!");
                                break;
                            case "Fake Gun":
                                this.target.holdItem("Gun", { cursed: true })
                                this.target.queueAlert(":sy2h: You have received a gun!");
                                break;
                            case "Fake Armor":
                                this.target.holdItem("Armor", { cursed: true })
                                this.target.queueAlert(":sy1a: You have received armor!");
                                break;
                            case "Fake Knife":
                                this.target.holdItem("Knife", { cursed: true })
                                this.target.queueAlert(":sy3h: You have received a knife!");
                                break;
                            case "Fake Snowball":
                                this.target.holdItem("Snowball", { cursed: true })
                                this.target.queueAlert(":sy8b: You have received a snowball!");
                                break;
                            case "Fake Bread":
                                this.target.holdItem("Bread", { cursed: true })
                                this.target.queueAlert(":sy2c: You have received a piece of bread!");
                                break;
                        }
                        delete this.actor.role.data.itemType;
                    }
                }
            },
            "Choose Item": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "custom",
                targets: ["Gun", "Armor", "Knife", "Snowball", "Bread", "Fake Gun", "Fake Armor", "Fake Knife", "Fake Snowball", "Fake Bread"],
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
