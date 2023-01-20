const Card = require("../../Card");
const { PRIORITY_NIGHT_SAVER } = require("../../const/Priority");

module.exports = class TurnIntoTree extends Card {

    constructor(role) {
        super(role);
        this.role.data.tree = false;
        this.meetings = {
            "Grow Into Tree?": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "boolean",
                shouldMeet: function (){
                    return !this.data.tree;
                },
                action: {
                    priority: PRIORITY_NIGHT_SAVER,
                    run: function () {
                        if (this.target === "Yes"){
                            this.actor.role.data.tree = true;
                            this.actor.role.immunity.kill = 3;
                            this.actor.role.cancelImmunity = ["ignite"];
                            //disable voting here somehow
                            this.actor.queueAlert("You grow into a tree!");
                        }
                    }
                }
            }
        };
    }

}