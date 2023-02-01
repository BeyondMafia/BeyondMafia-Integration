const Card = require("../../Card");
const { LABEL_INVESTIGATE, LABEL_ALIGNMENT } = require("../../const/ActionLabel");
const { FLAG_GROUP, FLAG_VOTING } = require("../../const/MeetingFlag");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");
const { STATE_NIGHT } = require("../../const/States");

module.exports = class AlignmentLearnerNaive extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Learn Naive Alignment": {
                actionName: "Learn Alignment",
                states: [ STATE_NIGHT ],
                flags: [ FLAG_GROUP, FLAG_VOTING ],
                action: {
                    labels: [ LABEL_INVESTIGATE, LABEL_ALIGNMENT ],
                    priority: PRIORITY_INVESTIGATIVE_DEFAULT,
                    run: function () {
                        var alert = `You learn that ${this.target.name} is sided with the Village.`;
                        this.game.queueAlert(alert, 0, this.meeting.getPlayers());
                    }
                }
            }
        }
    };

}
