const Card = require("../../Card");
const { PRIORITY_CHALLENGE, PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class IssueChallenge extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Issue Challenge": {
                states: ["Day"],
                flags: ["voting"],
                action: {
                    labels: ["challenge"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function () {
                        if (this.dominates()) {
                            this.target.holdItem("Challenge");
                            this.actor.holdItem("Challenge");
                            this.actor.role.data.challenger = this.target;
                            this.actor.role.data.gambler = this.actor;}
                    }
                }
            },
            "RPS A": {
                actionName: "Rock, Paper, Scissors",
                states: ["Night"],
                flags: ["exclusive", "voting", "group", "anonymous"],
                inputType: "alignment",
                targets: ["Rock", "Paper", "Scissors"],
                shouldMeet: function () {
                    for (let player of this.game.players)
                        if (player.hasItem("Challenge"))
                            return true;

                    return false;
                },
                action: {
                    labels: ["challenge"],
                    priority: PRIORITY_CHALLENGE,
                    run: function () {
                        var challenger = this.actor.role.data.challenger;

                        if (challenger)
                            return;
                        this.actor.role.data.rpsA = this.target;
                    }
                }
            },
            "RPS B": {
                actionName: "Rock, Paper, Scissors",
                states: ["Night"],
                flags: ["exclusive", "voting", "group", "anonymous"],
                inputType: "alignment",
                targets: ["Rock", "Paper", "Scissors"],
                shouldMeet: function () {
                    for (let player of this.game.players)
                        if (player.hasItem("Challenge"))
                            return true;

                    return false;
                },
                action: {
                    labels: ["challenge"],
                    priority: PRIORITY_CHALLENGE,
                    run: function () {
                        var gambler = this.actor.role.data.gambler;

                        if (gambler)
                            return;
                        this.actor.role.data.rpsB = this.target;
                    }
                }
            },
        };
        this.listeners = {
            "afterActions": function () {
                if (
                    this.actor.role.data.rpsB == 'Rock' && this.actor.role.data.rpsA == 'Scissor' ||
                    this.actor.role.data.rpsB == 'Scissor' && this.actor.role.data.rpsA == 'Paper' ||
                    this.actor.role.data.rpsB == 'Paper' && this.actor.role.data.rpsA == 'Rock'
                   ) {
                    return this.actor.role.data.challengeWon + 1;
                    }
            }
        };
    }

    }

}
