const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class GainKnifeIfVisitedNonMonster extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_ITEM_GIVER_DEFAULT,
                labels: ["hidden", "absolute"],
                run: function () {
                    if (this.game.getStateName() !== "Night")
                        return;

                    let visitors = this.getVisitors(this.player);
                    let visitorsAlignments = visitors.map(player => player.role.alignment);
                    let monstersCount = visitorsAlignments.filter(alignment => alignment=="Monsters").length;

                    if(visitorsAlignments.length > 0 &&
                        visitorsAlignments.length !== monstersCount){
                        this.actor.holdItem("Knife");
                        this.queueGetItemAlert("Knife", this.actor);
                    }
                }
            }
        ];
    }
}
