const Action = require("../../core/Action");
const Random = require("../../../lib/Random");

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

    queueGetItemAlert(itemName, target) {
        target = target || this.target;
        target.queueAlert(`You have received ${(itemName === "Armor" ? itemName : "a " + itemName).toLowerCase()}!`);
    }

    stealItem(item, toGive) {
        toGive = toGive || this.actor;

        if (item.cannotBeStolen) {
            return false;
        }

        item.drop();
        item.hold(toGive);
        this.queueGetItemAlert(item.name, toGive);
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

        let numItems = victim.items.length;
        let toSteal = 0;
        for (let i = 0; i < numItems; i++) {
            let stolen = this.stealItem(victim.items[toSteal], toGive)
            if (!stolen) {
                toSteal += 1;
            }
        }
    }
}