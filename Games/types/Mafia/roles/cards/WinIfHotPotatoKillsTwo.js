const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class WinIfHotPotatoKillsTwo extends Card {

    constructor(role) {
        super(role);

        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            check: function(counts, winners, aliveCount) {
                if (this.player.alive && winners.groups[this.name] &&
                    (this.hotPotatoKills >= 2 || aliveCount <= 2)) {
                    winners.addPlayer(this.player, this.name)
                } 
            }
        };

        this.listeners = {
            "death": function (player, killer, deathType, instant) {
                if (this.player.alive && 
                    deathType === "bomb" && 
                    killer === this.player &&
                    player !== this.player) {
                    this.hotPotatoKills += 1;
                }
            }
        };

    }
}