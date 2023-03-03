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

    stealItem(givenPlayer,item) {
        item.hold(givenPlayer);
        item.drop();
        givenPlayer.queueAlert(`You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
    }

    stealRandomItem(givenPlayer) {
        let items = Random.randomizeArray(this.target.items);
        for (let item of items) {
            if (item.cannotBeStolen) {
                continue;
            }

            item.drop();
            item.hold(givenPlayer);
            givenPlayer.queueAlert(`You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
            return;
        }
    }

    stealAllItems(givenPlayer) {
        for (let item of this.target.items) {
            if (item.cannotBeStolen) {
                continue;
            }

            item.drop();
            item.hold(given);
            givenPlayer.queueAlert(`You have recieved ${(item.name === "Armor" ? item.name : "a " + item.name).toLowerCase()}!`);
        }
    }
}