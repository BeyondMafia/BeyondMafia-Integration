const Card = require("../../Card");
const { PRIORITY_WIN_NO_MAF } = require("../../const/Priority");

module.exports = class WinWithMafia extends Card {

    constructor(role) {
        super(role);

        this.winCheck = {
            priority: PRIORITY_WIN_NO_MAF,
            check: function (counts, winners, aliveCount) {
                if (this.player.alive && counts["Mafia"] >= aliveCount / 2 && aliveCount > 0)
                    {
                        winners.addPlayer(this.player, this.player.role.name);
                        winners.removeGroup("Mafia");
                    }

            }
        };
    }

}
