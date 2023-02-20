const { PRIORITY_REVEAL_TARGET_ON_DEATH } = require("../const/Priority");
const Item = require("../Item");

module.exports = class Crystal extends Item {

    constructor() {
        super("Crystal");

        this.meetings = {
            "Reveal on Death": {
                actionName: "Reveal on Death",
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["hidden", "absolute"],
                    priority: PRIORITY_REVEAL_TARGET_ON_DEATH,
                    item: this,
                    run: function () {
                        this.actor.role.data.playerToReveal = this.target;
                    },
                }
            }
        };
    }

}