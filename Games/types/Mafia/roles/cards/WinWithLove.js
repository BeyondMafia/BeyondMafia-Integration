const Card = require("../../Card");
const { PRIORITY_WIN_IF_ALIVE } = require("../../const/Priority");

module.exports = class WinWithLove extends Card {

    constructor(role) {
        super(role);

        this.winCheck = {
            priority: PRIORITY_WIN_IF_ALIVE,
            againOnFinished: true,
            check: function(counts, winners, aliveCount, confirmedFinished) {
                if (
                    this.player.alive &&
                    this.data.loves &&
                    this.data.loves.alive && (
                        (!confirmedFinished && counts["Village"] == aliveCount) ||
                        (confirmedFinished && !winners.groups[this.name]))
                ) {
                    winners.addPlayer(this.player, this.name)
                }
            }
        };


    }

}