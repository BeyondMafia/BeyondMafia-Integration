const Item = require("../Item");
const { PRIORITY_REVEAL_TARGET_ON_DEATH } = require("../const/Priority");

module.exports = class Crystal extends Item {

    constructor() {
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
                    },
                }
            }
        };
        this.listeners = {
            "death": function (player, killer, deathType) {
                if (player == this.holder && this.holder.role.data.playerToReveal)
                    this.holder.role.data.playerToReveal.role.revealToAll();
                    this.drop();
            }
        };
        this.stealableListeners = {
            "death": this
        };
    }

}