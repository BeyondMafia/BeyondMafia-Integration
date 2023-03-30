const Card = require("../../Card");
const { PRIORITY_ALIGNMENT_LEARNER } = require("../../const/Priority");

module.exports = class AlignmentLearnerParanoid extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Learn Paranoid Alignment": {
                actionName: "Learn Alignment",
                states: ["Night"],
                flags: ["group", "voting"],
                action: {
                    labels: ["investigate", "alignment"],
                    priority: PRIORITY_ALIGNMENT_LEARNER,
                    run: function () {
                        var alert = `:sy0d: You learn that ${this.target.name} is sided with the Mafia.`;
                        this.game.queueAlert(alert, 0, this.meeting.getPlayers());
                    }
                }
            }
        }
    };

}
