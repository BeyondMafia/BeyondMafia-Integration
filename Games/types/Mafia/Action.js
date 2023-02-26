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

    // Pre-condition: uses EnqueueVisitors
    isVisited() {
        return this.actor.role.data.visitors?.length
    }
}