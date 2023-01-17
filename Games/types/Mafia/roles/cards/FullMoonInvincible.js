const Card = require("../../Card");

module.exports = class FullMoonInvincible extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "stateEvents": function (stateEvents) {
                if (stateEvents["Full Moon"]) {
                    this.player.setTempImmunity("kill", 1);
                    this.player.queueAlert("You are invincible tonight.");
                }
            }
        };
    }

}