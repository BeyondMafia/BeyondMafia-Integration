const Card = require("../../Card");
const { PRIORITY_CLEANSE_VISITORS } = require("../../const/Priority");
const Random = require("../../../../../lib/Random");

module.exports = class CleanseVisitors extends Card {

    constructor(role) {
        super(role);

        this.actions = [
            {
                priority: PRIORITY_CLEANSE_VISITORS,
                labels: ["cleanse", "werewolf", "hidden"],
                run: function () {
                    if (this.game.getStateName() != "Night")
                        return;

                    var cleansedWolves = {};

                    for (let action of this.game.actions[0]) {
                        if (
                            action.target == this.actor &&
                            action.priority > this.priority &&
                            !action.hasLabel("hidden")
                        ) {
                            if (action.actor.hasEffect("Werewolf")){
                                action.actor.removeEffect("Werewolf", true);
                                cleansedWolves[action.actor.id] = true;
                            }
                            if (action.hasLabel("kill") &&
                            !action.hasLabel("werewolf") &&
                            action.actor.role.name !== "Lycan" &&
                            Random.randInt(0, 1)){
                                if (action.actor.role.alignment === "Village"){
                                    action.actor.setRole("Villager");
                                }else if(action.actor.role.alignment === "Mafia"){
                                    action.actor.setRole("Traitor");
                                }else{
                                    action.actor.setRole("Survivor");
                                }
                            }
                        }
                    }

                    if (Object.keys(cleansedWolves).length == 0)
                        return;

                    for (let action of this.game.actions[0]) {
                        if (
                            action.actor &&
                            cleansedWolves[action.actor.id] &&
                            action.hasLabels(["kill", "werewolf"])
                        ) {
                            action.cancel();
                        }
                    }
                }
            }
        ];
    }

}