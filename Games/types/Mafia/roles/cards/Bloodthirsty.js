const Card = require("../../Card");

module.exports = class Bloodthirsty extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "rolesAssigned": function (player) {
                if (player && player != this.player) {
                    return;
                }

                this.player.data.blood = 50;
                this.player.queueAlert(`You have ${this.player.data.blood}% blood left!`);
            },
            "actionsNext": function () {
                if (!this.player.alive)
                    return;

                if (this.game.getStateName() != "Day")
                    return;

                this.player.data.blood -= 25;
                if (this.player.data.blood <= 0){
                    this.player.kill("bloodthirst", this.player);
                } else if (this.player.data.blood <= 25){
                    this.player.queueAlert(`You hunger for blood. You now have ${this.player.data.blood}% blood left! If you don't kill anybody before the next day, you will die!`);
                } else {
                    this.player.queueAlert(`You hunger for blood. You now have ${this.player.data.blood}% blood left!`);
                }
            },
            "death": function (player, killer, deathType) {
                if (killer === this.player && player !== this.player && deathType !== "lynch"){
                    this.data.blood = Math.min(this.player.data.blood+50, 100);
                    this.player.queueAlert(`You have successful killed someone! You now have ${this.player.data.blood}% blood left!`);
                }
            }
        }
    }
}
