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
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player == this.holder && this.holder.role.data.playerToReveal)
                    this.holder.role.data.playerToReveal.role.revealToAll();
            }
        };
        this.stealableListeners = {
            "death": this
        };
    }

}