const Card = require("../../Card");
const Random = require("../../../../../lib/Random");

module.exports = class DefendAndSnatchGun extends Card {

    constructor(role) {
        super(role);

        this.immunity["gun"] = "Infinity";
        this.listeners = {
            "immune": function(action) {
                if (action.target !== this.player) {
                    return
                }

                let toSnatch = Random.randFloatRange(0, 100) <= 80;
                if (toSnatch) {
                    action.item.hold(this.player);
                    action.item.incrementMeetingName();
                    this.game.instantMeeting(action.item.meetings, [this.player]);
                    return;
                }

                // kill player
                delete this.player.role.immunity["gun"]
                this.player.kill("gun", action.actor, true);
            }
        };
    }

}