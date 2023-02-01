const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinIfDead extends Card {

    constructor(role) {
        super(role);

        this.winCount = "Village";
        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount) {
                if (!this.player.alive) {
                    winners.addPlayer(this.player, this.name);
                }
            }
        };
    }

}