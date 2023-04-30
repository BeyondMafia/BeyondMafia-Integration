const Card = require("../../Card");

module.exports = class WinWithTown extends Card {

    constructor(role) {
        super(role);

        this.winCheck = {
            priority: 0,
            check: function (counts, winners, aliveCount) {
                if (counts["Town"] == aliveCount && aliveCount > 0)
                    winners.addPlayer(this.player, "Town");
            }
        };
    }

}