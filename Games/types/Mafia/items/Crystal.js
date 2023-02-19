const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class Crystal extends Item {

    constructor(options) {
        super("Crystal");

        this.meetings = {
            "Reveal on Death": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["hidden", "absolute"],
                    priority: PRIORITY_REVEAL_TARGET_ON_DEATH,
                    run: function () {
                        this.actor.role.data.playerToReveal = this.target;
                    }
                }
            }
        };
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player == this.player && this.data.playerToReveal)
                    this.data.playerToReveal.role.revealToAll();
            }
        };
        this.stealableListeners = {
            "death": this
        };
    }

}