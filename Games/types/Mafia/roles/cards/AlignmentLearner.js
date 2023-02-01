const Card = require("../../Card");
const { LABEL_INVESTIGATE, LABEL_ALIGNMENT } = require("../../const/ActionLabel");
const { FLAG_VOTING } = require("../../const/MeetingFlag");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");
const { STATE_NIGHT } = require("../../const/States");


module.exports = class AlignmentLearner extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Learn Alignment": {
                states: [ STATE_NIGHT ],
                flags: [ FLAG_VOTING ],
                action: {
                    labels: [ LABEL_INVESTIGATE, LABEL_ALIGNMENT ],
                    priority: PRIORITY_INVESTIGATIVE_DEFAULT,
                    run: function () {
                        var role = this.target.getAppearance("investigate", true);
                        var alignment = this.game.getRoleAlignment(role);

                        if (alignment == "Independent")
                            alignment = "neither the Village, Mafia, nor Monsters"
                        else
                            alignment = `the ${alignment}`;

                        var alert = `You learn that ${this.target.name} is sided with the ${alignment}.`;
                        this.game.queueAlert(alert, 0, this.meeting.getPlayers());
                    }
                }
            }
        }
    };

}