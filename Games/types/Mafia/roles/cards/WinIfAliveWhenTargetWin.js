const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinIfAliveWhenTargetWin extends Card {

    constructor(role) {
        super(role);
        
        this.meetings = {
            "Gain Alignment": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["visit"],
                    priority: PRIORITY_GAIN_ALIGNMENT,
                    run: function () {
                        this.data.targetName = this.target.name;
                    }
                }
            }
        
        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount, confirmedFinished) {
                if (this.player.alive && confirmedFinished && winners.groups[this.data.targetName]) {
                    winners.addPlayer(this.player, this.name);
                }
            }
        };
    }

}
