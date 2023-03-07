const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class TrickedWares extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                labels: ["giveItem"],
                priority: PRIORITY_ITEM_GIVER_DEFAULT - 1,
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;
                    
                    const players = this.game.players.filter(p => p != this.player);
                    const playerToGive = Random.randArrayVal(players);

                    var items = ["Gun", "Armor", "Knife", "Snowball", "Crystal"];
                    var itemToGive = Random.randArrayVal(items);

                    var isItemCursed = Random.randArrayVal([true, false]);

                    playerToGive.holdItem(itemToGive, {
                        cursed: isItemCursed,
                    })
                    this.queueGetItemAlert(itemToGive, playerToGive);
                }
            }
        ]
    }
};

