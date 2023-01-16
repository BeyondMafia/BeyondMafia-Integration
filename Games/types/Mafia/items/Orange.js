const Item = require("../Item");

module.exports = class Orange extends Item {

    constructor(reveal) {
        super("Orange");

        this.reveal = reveal;
        this.meetings = {
            "Visit Hot Springs": {
                actionName: "Visit the hot springs tonight?",
                states: [STATE_DAY],
                flags: [FLAG_VOTING],
                inputType: "boolean",
                action: {
                    labels: ["springs", LABEL_ORANGE],
                    priority: 10,
                    item: this,
                    run: function () {
                        if (this.target == "Yes") {
                            this.actor.role.data.visitHotSprings = true;
                        }
                    }
                }
            },
            "Hot Springs": {
                states: [STATE_NIGHT],
                flags: [FLAG_GROUP, FLAG_SPEECH, FLAG_ANONYMOUS],
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

    shouldDisableMeeting(name, options) {
        var stateInfo = this.game.getStateInfo();

        if (
            stateInfo.name.match(/Night/) &&
            this.holder.role.data.visitHotSprings &&
            name != "Hot Springs"
        )
            return true;
    }

}
