const Item = require("../Item");
const { PRIORITY_ASK_QUESTION } = require("../const/MeetingPriority");

module.exports = class Mourned extends Item {

    constructor(options) {
        super("Mourned");

        this.options = options || {};
        this.lifespan = 1;
        this.cannotBeStolen = true;
        this.meetings = {
            "Graveyard": {
				actionName: "Answer Mourner",
                states: ["Night"],
				flags: ["voting"],
                inputType: "boolean",
                priority: PRIORITY_ASK_QUESTION,
                whileDead: true,
                whileAlive: false,
                run: function () {
                    this.game.events.emit("mournerAnswer", this.target, this.item.options.mourner);
                }
            }
        };
    }
}