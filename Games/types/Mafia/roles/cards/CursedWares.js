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
                                this.target.holdItem("CursedGun");
                                this.target.queueAlert("You have received a gun!");
                                break;
                            case "Armor":
                                this.target.holdItem("CursedArmor");
                                this.target.queueAlert("You have received armor!");
                                break;
                            case "Knife":
                                this.target.holdItem("CursedKnife");
                                this.target.queueAlert("You have received a knife!");
                                break;
                            case "Snowball":
                                this.target.holdItem("CursedSnowball");
                                this.target.queueAlert("You have received a snowball!");
                                break;
                            case "Bread":
                                this.target.holdItem("CursedBread");
                                this.target.queueAlert("You have received a bread!");
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