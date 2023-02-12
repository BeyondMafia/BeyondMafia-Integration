const Card = require("../../Card");
const { PRIORITY_OVERTHROW } = require("../../const/Priority");

module.exports = class OverturnLynch extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Overturn Lynch": {
                states: ["Overturn"],
                flags: ["group", "speech", "voting", "anonymousVotes"],
                targets: { include: ["alive"], exclude: ["dead", "self"] },
                leader: true,
                action: {
                    priority: PRIORITY_OVERTHROW,
                    power: 3,
                    labels: ["kill"],
                    run: function () {
                        if (this.dominates())
                            this.target.kill("lynch", this.actor);

                        for (let action of this.game.actions[0])
                            if (action.hasLabel("lynch"))
                                action.cancel(true);

                        --this.actor.role.overturnsLeft;
                    }
                }
            },
        };

        this.stateMods = {
            "Day": {
                type: "delayActions",
                delayActions: true
            },
            "Overturn": {
                type: "add",
                index: 4,
                length: 1000 * 30,
                shouldSkip: function () {
                    if (!this.overturnsLeft)
                        return true;

                    for (let player of this.game.players) {
                        player.holdItem("OverturnSpectator");
                    }

                    return false;
                }
            }
        };
    }

}