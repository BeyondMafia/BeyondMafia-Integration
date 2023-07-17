const Card = require("../../Card");
const { PRIORITY_DEFAULT } = require("../../const/Priority");

module.exports = class WinCorrectGuess extends Card {

    constructor(role) {
        super(role);

        this.winCheck = {
            priority: PRIORITY_DEFAULT,
            check: function (winners) {
                if (this.player.role.guessedCorrectly)
                    winners.addPlayer(this.player, "Jotters");
            }
        };
    }

}
