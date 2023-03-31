const Card = require("../../Card");

module.exports = class Bloodthirsty extends Card {

    constructor(role) {
        super(role);

        role.data.blood = 50;

        this.listeners = {
            "rolesAssigned": function () {
                this.player.queueAlert(`You have ${this.data.blood}% blood left!`);
            },
            "actionsNext": function () {
                if (!this.player.alive)
                    return;

                if (this.game.getStateName() != "Night")
                    return;

                this.data.blood -= 25;
                if (this.data.blood <= 0){
                    this.player.kill("bloodthirst", this.player);
                }
                if (this.data.blood > 0){
                    if (this.data.blood <= 25){
                        this.player.queueAlert(`You hunger for blood. You now have ${this.data.blood}% blood left! If you don't kill anybody before the next day, you will die!`);
                    } else {
                        this.player.queueAlert(`You hunger for blood. You now have ${this.data.blood}% blood left!`);
                    }
                }
            },
            "death": function (player, killer, deathType) {
                if (killer === this.player && player !== this.player && deathType !== "lynch"){
                    this.data.blood += Math.max(this.data.blood+50, 100);
                    this.player.queueAlert(`You have successful killed someone! You now have ${this.data.blood}% blood left!`);
                }
            }
        }
    }
}
