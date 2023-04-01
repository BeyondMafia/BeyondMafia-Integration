const Card = require("../../Card");

module.exports = class Loud extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "state": function (){
                if (this.game.setup.startState == "Night" && this.game.getStateInfo().name == "Night 0"){
                    return;
                }

                if (this.game.setup.startState == "Day" && this.game.getStateInfo().name == "Day 1"){
                    return;
                }

                for (let alert of this.game.alertQueue) {
                    if (!alert.recipients) {
                        continue
                    }
                    for (let recipient of alert.recipients) {
                        if (recipient == this.player &&
                            !alert.message.startsWith("Graveyard participation")) {
                            this.game.queueAlert(`A Loud ${this.player.role.name} is overheard reading: ${alert.message}`);
                        }
                    }
                }
            }
        }
    }
}
