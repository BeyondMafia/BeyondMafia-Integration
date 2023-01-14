const Card = require("../../Card");
const { PRIORITY_WIN_IF_ALIVE, PRIORITY_FALL_IN_LOVE } = require("../../const/Priority");

module.exports = class BondedForLife extends Card {

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

        this.meetings = {
            "Fall in love": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_FALL_IN_LOVE,
                    run: function() {
                        this.actor.role.data.loves = this.target;
                        var alert = `You fall deathly in love with ${this.actor.name}.`;
                        this.target.queueAlert(alert);
                    }
                },
                shouldMeet() {
                    return !this.data.loves;
                }

            }
        };


        this.listeners = {

            "death": function(player, killer, deathType, instant) {
                if (
                    this.data.loves &&
                    player == this.player &&
                    this.data.loves.alive
                ) {
                    this.data.loves.kill("basic", killer, instant);
                }
                if (
                    this.data.loves &&
                    player == this.data.loves &&
                    this.player.alive
                ) {
                    this.player.kill("basic", killer, instant);
                }
            }
        };
    }

}