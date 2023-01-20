const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class TailorSuit extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Give Suit": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["giveItem", "suit"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT,
                    run: function () {
                        this.target.holdItem("Suit", this.actor.role.data.suit);
                        this.target.queueAlert("You have received a suit!");
                        delete this.actor.role.data.suit;
                    }
                }
            },
            "Choose Suit": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: [],
                action: {
                    labels: ["giveItem", "suit"],
                    priority: PRIORITY_ITEM_GIVER_DEFAULT - 1,
                    run: function () {
                        this.actor.role.data.suit = this.target;
                    }
                }
            }
        };
        this.listeners = {
            "rolesAssigned": function () {
                this.player.role.meetings["Choose Suit"].targets = Array.from(new Set(this.game.players.map(a => a.role.name))).sort();
            },
            "afterActions": function () {
                this.player.role.meetings["Choose Suit"].targets = Array.from(new Set(this.game.players.map(a => a.role.name))).sort();
            }
        };
    }

}
