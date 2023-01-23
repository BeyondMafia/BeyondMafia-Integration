const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class Gun extends Item {

    constructor(options) {
        super("Gun");

        this.options = options || {}
        this.meetings = {
            "Shoot Gun": {
                actionName: "Shoot",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["kill", "gun"],
                    item: this,
                    run: function () {
                        var reveal = this.actor.data.shooterMask || this.item.options.reveal ||  Random.randArrayVal([true, false]);
                        var shooterMask = this.actor.data.shooterMask || this.actor.name;
                        var mafiaImmune = this.item.options.mafiaImmune || false;
                        var cursed = this.item.options.cursed || false;

                        if (cursed) {
                            this.target = this.actor;
                        }

                        if (reveal && cursed)
                            this.game.queueAlert(`${shooterMask} pulls a gun, it backfires!`);
                        else if (reveal && !cursed)
                            this.game.queueAlert(`${shooterMask} pulls a gun and shoots at ${this.target.name}!`);
                        else
                            this.game.queueAlert(`Someone fires a gun at ${this.target.name}!`);

                        // kill
                        var toKill = this.dominates();
                        if (mafiaImmune && this.target.role.alignment == "Mafia")
                            toKill = false

                        if (toKill)
                            this.target.kill("gun", this.actor, true);
                            
                        this.item.drop();
                        this.game.broadcast("gunshot");
                    }
                }
            }
        };
    }

}
