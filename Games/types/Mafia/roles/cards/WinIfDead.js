const Card = require("../../Card");
const { PRIORITY_WIN_IF_LYNCHED } = require("../../const/Priority");

module.exports = class WinIfLynched extends Card {

    constructor(role) {
        super(role);

        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            check: function (counts, winners, aliveCount) {
                if (this.actor.role.data.dead)
                    winners.addPlayer(this.player, this.name);
            }
        };
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player == this.player)
                    this.actor.role.data.dead = true;
            }
        };
    }

}