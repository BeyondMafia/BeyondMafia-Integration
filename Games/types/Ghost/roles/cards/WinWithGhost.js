const Card = require("../../Card");

module.exports = class WinWithGhost extends Card {

    constructor(role) {
        super(role);

        this.winCheck = {
            priority: 0,
            check: function (counts, winners, aliveCount) {
                if (counts["Ghost"] == aliveCount && aliveCount > 0)
                    winners.addPlayer(this.player, "Ghost");
            }
        };
    }

}