const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinIfTargetDead extends Card {

    constructor(role) {
        super(role);

        this.actor.role.data.killer = null;
        this.actor.role.data.target_killed = false;

        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount) {
                if (!this.actor.role.data.killer.alive) { // if var is true spirit wins
                    winners.addPlayer(this.player, this.name);
                }
            }
        };
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player == this.player && deathType != "lynch") { // if not lynched, stores the killer
                    this.actor.role.data.killer = killer;
                }

            } 
        };
    }

}