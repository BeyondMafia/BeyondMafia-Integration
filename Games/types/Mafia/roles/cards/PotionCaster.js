const Card = require("../../Card");
const { PRIORITY_ROLE_LEANER } = require("../../const/Priority");

module.exports = class PotionCaster extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Cast Potion": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["investigate", "role", "save", "kill"],
                    priority: PRIORITY_ROLE_LEANER - 1,
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
                        this.actor.role.data.potionCounter[potion] = 2;
                        delete this.actor.role.data.potionType;
                    }
                }
            },
            "Choose Potion": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: this.actor.role.data.potionList,
                action: {
                    priority: PRIORITY_ROLE_LEANER - 2,
                    run: function() {
                        this.actor.role.data.potionType = this.target;
                    }
                }
            },
        };

        this.listeners = {
            "rolesAssigned": function() {
                this.data.potionCounter = {"Attacking": 0, "Healing": 0, "Exposing": 0};
                this.data.potionList = ["Attacking", "Healing", "Exposing"];
            },
            "state": function (stateInfo) {
                if (!stateInfo.name.match(/Night/)) {
                    return
                }

                var tempPotion = [];
                for (let potion in potionList){
                    this.data.potionCounter[potion] = Math.min(0, this.data.potionCounter[potion]-1);
                    if (this.data.potionCounter[potion] === 0){
                        tempPotion.push(potion);
                    }
                }
                this.data.potionList = tempPotion;
            }

        };
    }
}
