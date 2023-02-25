const Card = require("../../Card");
const { LABEL_INVESTIGATE, LABEL_ALIGNMENT } = require("../../const/ActionLabel");
const { FLAG_VOTING } = require("../../const/MeetingFlag");
const { PRIORITY_ALIGNMENT_LEARNER } = require("../../const/Priority");
const { STATE_NIGHT } = require("../../const/States");

module.exports = class NaughtyOrNice extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Check List": {
                states: [ STATE_NIGHT ],
                flags: [ FLAG_VOTING ],
                action: {
                    labels: [ LABEL_INVESTIGATE, LABEL_ALIGNMENT ],
                    priority: PRIORITY_ALIGNMENT_LEARNER,
                    run: function () {
                        if (!this.actor.role.data.visitors?.length)
                            {
                                let role = this.target.getAppearance("investigate", true);
                                let alignment = this.game.getRoleAlignment(role);
                                let naughtyOrNice;
                                switch (alignment){
                                    case "Village":
                                        naughtyOrNice = "nice";
                                        break;
                                    case "Mafia":
                                    case "Monsters":
                                        naughtyOrNice = "naughty";
                                        break;
                                    default:
                                        naughtyOrNice = "neither naughty nor nice";
                                        break;
                                }
                                let alert = `You learn that ${this.target.name} is ${naughtyOrNice}!`;
                                this.game.queueAlert(alert, 0, this.meeting.getPlayers());
                            }
                    }
                }
            }
        }
    };

}