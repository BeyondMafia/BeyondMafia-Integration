const Card = require("../../Card");
const { PRIORITY_DATE_A, PRIORITY_DATE_B_AND_CHECK } = require("../../const/Priority");

module.exports = class MeetYourMatch extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Lovebird A": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_DATE_A,
                    run: function() {
                        this.actor.role.data.lovebirdA = this.target;
                    }
                },
            },
            "Lovebird B": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["effect", "love"],
                    priority: PRIORITY_DATE_B_AND_CHECK,
                    run: function() {
                        var lovebirdA = this.actor.role.data.lovebirdA;
                        var lovebirdB = this.target;
                        var roleA = lovebirdA.getAppearance("investigate", true);
                        var alignmentA = this.game.getRoleAlignment(roleA);
                        var roleB = lovebirdB.getAppearance("investigate", true);
                        var alignmentB = this.game.getRoleAlignment(roleB);
                        var alert;
                        if (alignmentA == alignmentB) {
                            lovebirdA.giveEffect("Love", this.actor);
                            lovebirdB.giveEffect("Love", this.actor);
                            alert = `${lovebirdA.name} and ${lovebirdB.name}'s date went well. They are now in love.`;
                        } else {
                            alert = `${lovebirdA.name} and ${lovebirdB.name}'s date went poorly. Better luck next time.`;
                        }
                        this.actor.queueAlert(alert)
                    }
                },
            }
        };

    }
}