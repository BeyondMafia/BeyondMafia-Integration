const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinIfSeerGuessed extends Card {

    constructor(role) {
        super(role);
      
      this.meetings = {
            "Guess Seer": {
                states: ["Night"],
                flags: ["voting", "exclusive"],
                shouldMeet: function () {
                    for (let player of this.game.players)
                        if (player.hasItem("Guess"))
                            return true;

                    return false;
                },
                action: {
                    labels: ["visit"],
                    priority: PRIORITY_WIN_CHECK_DEFAULT  - 1,
                    run: function () {
                        if (this.target.role = "Seer") {
                            this.data.guessedMerlin = "true";
                        }
                    }
                }
            }

        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            check: function (counts, winners, aliveCount) {
                if (this.data.guessedMerlin == "true")
                    winners.addPlayer(this.player, this.player.role.alignment == "Mafia" ? "Mafia" : this.player.role.name);
            }
        };
    }

}
