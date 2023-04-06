const Card = require("../../Card");
const { PRIORITY_ROLE_LEARNER } = require("../../const/Priority");

module.exports = class PotionCaster extends Card {

    constructor(role) {
        super(role);

        role.data.potionCounter = {"Attacking": 0, "Healing": 0, "Exposing": 0};
        role.data.potionList = ["Attacking", "Healing", "Exposing"];

        this.meetings = {
            "Cast Potion": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["investigate", "role", "save", "kill"],
                    priority: PRIORITY_ROLE_LEARNER - 1,
                    run: function () {
                        var potion = this.actor.role.data.potionType;

                        switch (potion){
                            case "Attacking":
                                if (this.dominates())
                                    this.target.kill("basic", this.actor);
                                break;
                            case "Healing":
                                this.heal(1);
                                break;
                            case "Exposing":
                                var role = this.target.getAppearance("investigate", true);
                                this.actor.queueAlert(`:sy0d: You learn that ${this.target.name}'s role is ${role}.`);
                                break;
                        }
                        this.player.queueAlert(this.actor.role.data.potionCounter);
                        this.actor.role.data.potionCounter[potion] = 2;
                        delete this.actor.role.data.potionType;
                    }
                }
            },
            "Choose Potion": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: {exclude: [offCooldown]},
                targets: this.actor.role.data.potionList,
                action: {
                    priority: PRIORITY_ROLE_LEARNER - 2,
                    run: function() {
                        this.actor.role.data.potionType = this.target;
                    }
                }
            },
        };

        this.listeners = {
            "state": function (stateInfo) {
                if (!stateInfo.name.match(/Night/)) {
                    return;
                }

                for (let potion in role.data.potionCounter){
                    role.data.potionCounter[potion] = Math.min(0, role.data.potionCounter[potion]-1);
                    //this.player.queueAlert(this.data.potionCounter[potion]);
                }
            }
        };
    }
}

function offCooldown(potion) {
    return role.data.potionCounter[potion] === 0;
}