const { PRIORITY_HOT_SPRING } = require("../const/Priority");
const Item = require("../Item");
const {HOT_SPRINGS_MEETING_PRIORITY} = require("../const/MeetingPriority");

module.exports = class Orange extends Item {

    constructor(reveal) {
        super("Orange");

        this.reveal = reveal;
        this.meetings = {
            "Visit Hot Springs": {
                actionName: "Visit the hot springs tonight?",
                states: ["Day"],
                flags: ["voting"],
                inputType: "boolean",
                action: {
                    labels: ["springs", "orange"],
                    priority: PRIORITY_HOT_SPRING,
                    item: this,
                    run: function () {
                        if (this.target == "Yes") {
                            this.actor.role.data.visitHotSprings = true;
                        }
                    }
                }
            },
            "Hot Springs": {
                states: ["Night"],
                flags: ["group", "speech", "anonymous"],
                exclusive: true,
                priority: HOT_SPRINGS_MEETING_PRIORITY,
                shouldMeet: function () {
                    return this.data.visitHotSprings;
                }
            }
        };
        this.listeners = {
            "actionsNext": function (stateInfo) {
                var stateInfo = this.game.getStateInfo();

                if (stateInfo.name.match(/Night/) && this.holder.role.data.visitHotSprings) {
                    this.drop();
                    this.holder.role.data.visitHotSprings = false;
                }
            }
        };
    }
}