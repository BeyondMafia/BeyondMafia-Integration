const Action = require("../../core/Action");
const Random = require("../../../lib/Random");

module.exports = class MafiaAction extends Action {

    constructor(options) {
        super(options);
    }

    heal(power, target) {
        target = target || this.target;
        
        target.setTempImmunity("kill", power);
        target.removeEffect("Poison", true);
    }

    blockActions(){
        for (let action of this.game.actions[0]) {
            if (action.priority > this.priority &&
                !action.hasLabel("absolute")) {
                    action.cancelActor(this.target);
            }
        }
    }

    getVisitors(player, label) {
        player = player || this.actor;

        var visitors = [];
        for (let action of this.game.actions[0]) {

            if (label && !action.hasLabel(label)) {
                continue;
            }
            
            let toCheck = action.target;
            if (!Array.isArray(action.target)) {
                toCheck = [action.target];
            }

            for (let target of toCheck) {
                if (target === player && !action.hasLabel("hidden")) {
                    visitors.push(action.actor);
                }
            }
        }

        return visitors;
    }

    getReports(player) {
        player = player || this.target;
        let reports = [];

        for (let alert of this.game.alertQueue) {
            if (!alert.recipients) {
                continue
            }

            if (alert.message.startsWith("Graveyard participation")) {
                continue
            }
            
            for (let recipient of alert.recipients) {
                if (recipient === player) {
                    reports.push(alert.message);
                }
            }
        }

        return reports
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

    snoopAllItems(victim, excludeRoleItems) {
        victim = victim || this.target;

        let items = [];
        for (let item of this.target.items) {
            if (item.cannotBeSnooped) {
                continue;
            }

            items.push("a " + item.snoopName);
        }

        if (excludeRoleItems) {
            return items;
        }

        switch (victim.role.name) {
            case "Mason":
            case "Cultist":
                items.push("a Robe");
                break;
            case "Janitor":
                items.push("a Mop");
                break
        }

        return items;
    }
}