const Card = require("../../Card");
const { PRIORITY_ITEM_GIVER_DEFAULT } = require("../../const/Priority");

module.exports = class DayShooter extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_ITEM_GIVER_DEFAULT,
                labels: ["hidden", "absolute"],
                run: function () {
                    if (this.game.getStateName() !== "Night")
                        return;

                    let visitors = this.actor.role.data.visitors;

                    if(!visitors?.length){
                        this.actor.holdItem("Gun");
                    }
                }
            }
        ];

        this.listeners = {
            "death": function (player, killer) {
                if ((player === this.player) && killer)
                    {
                        killer.queueAlert("You find a gun in your victim's workshop...")
                        killer.holdItem("Gun", { reveal: true });
                    }
            }
        };
    }
}