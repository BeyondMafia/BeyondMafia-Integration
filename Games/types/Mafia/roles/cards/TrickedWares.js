const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class TrickedWares extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "state": function (stateInfo) {
                if (!stateInfo.name.match(/Night/)) {
                    return;
                }

                const players = this.game.players.filter(p => p != this.player);
                const playerToGive = Random.randArrayVal(players);

                this.actions[0].target = playerToGive;
            }
        };

        this.actions = [
            {
                labels: ["giveItem"],
                priority: PRIORITY_ITEM_GIVER_DEFAULT - 1,
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;
                    
                    var items = ["Gun", "Armor", "Knife", "Snowball", "Crystal"];
                    var itemToGive = Random.randArrayVal(items);
                    var isItemCursed = Random.randArrayVal([true, false]);

                    this.target.holdItem(itemToGive, {
                        cursed: isItemCursed,
                    })
                    this.queueGetItemAlert(itemToGive);
                }
            }
        ]
    }
};

