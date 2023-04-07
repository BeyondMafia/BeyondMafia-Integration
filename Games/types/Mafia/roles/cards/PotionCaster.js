const Card = require("../../Card");
const { PRIORITY_ROLE_LEARNER, PRIORITY_KILL_DEFAULT, PRIORITY_NIGHT_SAVER, PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class PotionCaster extends Card {

    constructor(role) {
        super(role);

        this.data.potionCounter = {"Attacking": 0, "Healing": 0, "Exposing": 0};
        this.data.potionList = ["Attacking", "Healing", "Exposing"];

        this.data.potionType = null;
        this.data.currentTarget = null;

        this.meetings = {
            "Cast Potion": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_NIGHT_SAVER - 1,
                    run: function () {
                        // set target
                        this.actor.role.data.currentTarget = this.target;

                        // set cooldown
                        var potion = this.actor.role.data.potionType;
                        this.actor.role.data.potionCounter[potion] = 2;
                    }
                }
            },
            "Choose Potion": {
                states: ["Night"],
                flags: ["voting"],
                inputType: "alignment",
                targets: role.data.potionList,
                action: {
                    priority: PRIORITY_ROLE_LEARNER - 2,
                    run: function() {
                        this.actor.role.data.potionType = this.target;
                    }
                }
            },
        };

        this.actions = [
            {
                priority: PRIORITY_KILL_DEFAULT,
                labels: ["kill"],
                run: function () {
                    if (this.game.getStateName() !== "Night") {
                        return;
                    }

                    if (this.actor.role.data.currentPotion !== "Healing")
                        return;

                    let target = this.actor.role.data.currentTarget;
                    if (!target) {
                        return;
                    }

                    if (this.dominates(target)) {
                        target.kill("basic", this.actor)
                    }

                    delete this.actor.role.data.potionType;
                    delete this.actor.role.data.currentTarget;
                }
            },
            {
                priority: PRIORITY_NIGHT_SAVER,
                labels: ["save"],
                run: function () {
                    if (this.game.getStateName() !== "Night") {
                        return;
                    }

                    if (this.actor.role.data.currentPotion !== "Attacking")
                        return;

                    let target = this.actor.role.data.currentTarget;
                    if (!target) {
                        return;
                    }

                    this.heal(1, target);
                    
                    delete this.actor.role.data.potionType;
                    delete this.actor.role.data.currentTarget;
                }
            },
            {
                priority: PRIORITY_INVESTIGATIVE_DEFAULT,
                labels: ["investigate"],
                run: function () {
                    if (this.game.getStateName() !== "Night") {
                        return;
                    }

                    if (this.actor.role.data.currentPotion !== "Exposing")
                        return;

                    let target = this.actor.role.data.currentTarget;
                    if (!target) {
                        return;
                    }

                    let role = target.getAppearance("investigate", true);
                    this.actor.queueAlert(`:sy0d: You learn that ${target.name}'s role is ${role}.`);
                    
                    delete this.actor.role.data.potionType;
                    delete this.actor.role.data.currentTarget;
                }
            }
        ]

        this.listeners = {
            // refresh cooldown
            "state": function (stateInfo) {
                if (!stateInfo.name.match(/Night/)) {
                    return;
                }

                var tempPotion = [];
                for (let potion in role.data.potionList){
                    role.data.potionCounter[potion] = Math.max(0, role.data.potionCounter[potion]-1);
                    if (role.data.potionCounter[potion] <= 0){
                        tempPotion.push(potion);
                    }
                }

                role.data.potionList = tempPotion;
            }
        };
    }
}