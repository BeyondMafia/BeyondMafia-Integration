const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinIfTargetDead extends Card {

    constructor(role) {
        super(role);

        this.killer = null;

        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount, confirmedFinished) {
                if (!confirmedFinished && counts["Village"] != aliveCount) {
                    // game not ended
                    return;
                }

                if (this.killer && !this.killer.alive) {
                    winners.addPlayer(this.player, this.name);
                }
            }
        };
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player == this.player && deathType != "lynch") {
                    this.killer = killer;
                }
            } 
        };
    }

}