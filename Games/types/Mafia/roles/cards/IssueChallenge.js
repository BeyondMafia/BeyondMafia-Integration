const Card = require("../../Card");
const { PRIORITY_CHALLENGE, PRIORITY_DAY_DEFAULT } = require("../../const/Priority");

module.exports = class IssueChallenge extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Jail Target": {
                states: ["Day"],
                flags: ["voting"],
                action: {
                    labels: ["challenge"],
                    priority: PRIORITY_DAY_DEFAULT,
                    run: function () {
                        if (this.dominates()) {
                            this.target.holdItem("Challenge");
                            this.actor.holdItem("Challenge");
                            this.data.chalenged = this.target;
                            this.data.chalenger = this.actor;}
                    }
                }
            },
            "RPS A": {
                actionName: "Rock, Paper, Scissors",
                states: ["Night"],
                flags: ["exclusive", "voting"],
                inputType: "alignment",
                targets: ['Rock', 'Paper', 'Scissors'],
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
                        var challenged = this.data.chalenged;

                        if (challenged)
                            return;
                        this.data.rpsA = this.target;
                    }
                }
            },
            "RPS B": {
                actionName: "Rock, Paper, Scissors",
                states: ["Night"],
                flags: ["exclusive", "voting"],
                inputType: "alignment",
                targets: ['Rock', 'Paper', 'Scissors'],
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
                        var challenger = this.data.chalenger;

                        if (challenger)
                            return;
                        this.data.rpsB = this.target;
                    }
                }
            }
        };
        this.listeners = {
            "afterActions": function () {
                if (
                    this.data.rpsB == 'Rock' && this.data.rpsA == 'Scissor' ||
                    this.data.rpsB == 'Scissor' && this.data.rpsA == 'Paper' ||
                    this.data.rpsB == 'Paper' && this.data.rpsA == 'Rock'
                   ) {
                    return this.data.challengeWon + 1;
                    }
            }
        };
    }

    }

}
