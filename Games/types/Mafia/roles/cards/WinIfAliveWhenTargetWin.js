const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinIfAliveWhenTargetWin extends Card {

    constructor(role) {
        super(role);
        
        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount, confirmedFinished) {
                if (this.player.alive && confirmedFinished && !winners.groups[this.data.targetAlignment]) {
                    winners.addPlayer(this.player, this.name);
                }
            }
        };
    }

}
