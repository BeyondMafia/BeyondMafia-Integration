const Action = require("../../core/Action");

module.exports = class MafiaAction extends Action {

    constructor(options) {
        super(options);
    }

    heal(power){
        this.target.setTempImmunity("kill", power);
        this.target.removeEffect("Poison", true);
    }

    blockActions(){
        for (let action of this.game.actions[0]) {
            if (action.priority > this.priority &&
                !action.hasLabel("absolute")) {
                    action.cancelActor(this.target);
            }
        }
    }

    getVisitors(player) {
        player = player || this.actor;

        var visitors = [];
        for (let action of this.game.actions[0]) {
            if (
                action.target == this.actor &&
                !action.hasLabel("hidden")
            ) {
                visitors.push(action.actor);
            }
        }

        return visitors;
    }

    stealItem(item, toGive) {
        toGive = toGive || this.actor;

        if (item.cannotBeStolen) {
            return false;
        }

        item.drop()
        item.hold(toGive);
        toGive.queueAlert(`You have received ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
        return true;
    }

    stealRandomItem(victim, toGive) {
        victim = victim || this.target;
        toGive = toGive || this.actor;

        let items = Random.randomizeArray(victim.items);
        for (let item of items) {
            if (this.stealItem(item, toGive)) {
                return;
            }
        }
    }

    stealAllItems(victim, toGive) {
        victim = victim || this.target;
        toGive = toGive || this.actor;

        for (let item of victim.items) {
            if (!this.stealItem(item, toGive)) {
                continue;
            }
        }
    }
}