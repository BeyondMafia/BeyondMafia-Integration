const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_WIN_BY_LYNCHING } = require("../../const/Priority");

module.exports = class WinByLynching extends Card {

    constructor(role) {
        super(role);
        this.actor.role.data.killer = None;
        this.actor.role.data.target_killed = false;
        const deathReasons = ["putting pineapple on pizza", "shopping at five or six stores instead of one", "leaving their lights on at night", "backing up into your mailbox", "forgetting to water your plants", "unfriending you on BeyondMafia", "Rickrolling you", "looking at you funny", "being wrong in Mafia once", "making you look bad", "chewing open-mouthed", "borrowing your lawnmower and never bringing it back", "stealing your lunch at work", "forgetting your birthday"];


        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount) {
                if (this.actor.role.data.target_killed) {
                    winners.addPlayer(this.player, this.name);
                    return true;
                }
            }
        };
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player == this.player && deathType != "lynch") {
                    this.actor.role.data.killer = killer;
                }
                if (player == this.actor.role.data.killer) {
                    this.actor.role.data.target_killed = true;
                }

            }
        };
    }

}