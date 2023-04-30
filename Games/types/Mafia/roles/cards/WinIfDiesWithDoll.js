const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinByLynching extends Card {

    constructor(role) {
        super(role);
        
        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount) {
                if (this.data.dollDeath) {
                    winners.addPlayer(this.player, this.name);
                    return true;
                }
            }
        };
        
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player.hasItem("Doll") && player.role !== this.player.role) {
                    this.data.dollDeath = true;
                }
            }
        };
    }

}