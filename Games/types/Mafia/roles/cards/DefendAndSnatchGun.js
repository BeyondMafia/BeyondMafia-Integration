const Card = require("../../Card");

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
                    action.item.hold(this.target);
                    action.item.incrementMeetingName();
                    this.game.instantMeeting(this.item.meetings, [this.target]);
                    return;
                }

                // kill player
                delete this.player.role.immunity["gun"]
                this.player.kill("gun", action.actor, true);
            }
        };
    }

}