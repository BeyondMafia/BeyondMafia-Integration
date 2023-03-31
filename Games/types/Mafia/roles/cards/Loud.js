const Card = require("../../Card");

module.exports = class Loud extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "state": function (){
                let reports = [];

                for (let alert of this.game.alertQueue) {
                    if (!alert.recipients) {
                        continue
                    }
                    for (let recipient of alert.recipients) {
                        if (recipient == this.player) {
                            this.game.queueAlert(`You overhear someone say: ${alert.message}`);
                        }
                    }
                }
            }
        }
    }
}
