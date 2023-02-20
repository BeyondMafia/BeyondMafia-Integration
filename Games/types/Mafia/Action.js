const Action = require("../../core/Action");
const Random = require("../../../lib/Random");
module.exports = class MafiaAction extends Action {

    constructor(options) {
        super(options);
    }

    healTarget(power) {
        this.target.setTempImmunity("kill", power);
        this.target.removeEffect("Poison", true);
    }

    roleblockTarget() {
        for (let action of this.game.actions[0]) {
            if (action.priority > this.priority &&
                !action.hasLabel("absolute")) {
                action.cancelActor(this.target);
            }
        }
    }

    trapTarget() {
        let visitors = [];
        for (let action of this.game.actions[0]) {
            if (action.priority > this.priority &&
                !action.hasLabel("hidden") &&
                action.target === this.target) {

                visitors.push(...action.actors);
            }
        }
        if (visitors.length) {
            if (this.dominates())
                Random.randArrayVal(visitors).kill("basic", this.actor);
        }
    }
}