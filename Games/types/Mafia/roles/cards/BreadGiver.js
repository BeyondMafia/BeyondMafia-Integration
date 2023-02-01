const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class BreadGiver extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Bread": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "bread"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        this.target.holdItem("Bread");
                        this.target.queueAlert("You have received a bread!");
                    }
                }
            },
            "Give More Bread": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "bread"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        this.target.holdItem("Bread");
                        this.target.queueAlert("You have received a bread!");
                    }
                }
            }
        };
        this.listeners = {
            "rolesAssigned": function () {
                for (let player of this.game.players){
                    if(!player.hasItem("Bread")){
                        player.holdItem("Bread");
                        player.holdItem("Bread");
                    }
                    if(!player.hasEffect("Famished"))
                        player.giveEffect("Famished");
                }
            },
        };
    }

}
