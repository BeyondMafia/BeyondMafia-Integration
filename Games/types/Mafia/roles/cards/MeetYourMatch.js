const Card = require("../../Card");
const { PRIORITY_DATE } = require("../../const/Priority");

module.exports = class MeetYourMatch extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Setup a Date": {
                states: ["Night"],
                flags: ["voting", "multi"],
                multiMin: 2,
                multiMax: 2,
                action: {
                    labels: ["effect", "love"],
                    priority: PRIORITY_DATE,
                    run: function() {
                        var lovebirdA = this.target[0];
                        var lovebirdB = this.target[1];

                        var alignmentA = lovebirdA.role.alignment;
                        var alignmentB = lovebirdB.role.alignment;
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