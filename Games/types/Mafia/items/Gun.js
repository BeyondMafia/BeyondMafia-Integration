const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class Gun extends Item {

    constructor(options) {
        super("Gun");

        this.reveal = options?.reveal;
        this.mafiaImmune = options?.mafiaImmune;
        this.cursed = options?.cursed;

        this.meetings = {
            "Shoot Gun": {
                actionName: "Shoot",
                states: ["Day"],
                flags: ["voting", "instant", "noVeg"],
                action: {
                    labels: ["kill", "gun"],
                    item: this,
                    run: function () {
                        var shooterMask = this.actor.role.data.shooterMask;
                        var reveal = shooterMask ? true : this.item.reveal;
                        if (reveal == null) {
                            reveal = Random.randArrayVal([true, false]);
                        }
                        if (shooterMask == null) {
                            shooterMask = this.actor.name;
                        }
                        
                        var mafiaImmune = this.item.mafiaImmune;
                        var cursed = this.item.cursed;

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

                        if (toKill) {
                            this.target.kill("gun", this.actor, true);
                        }

                        this.item.drop();
                        this.game.broadcast("gunshot");
                    }
                }
            }
        };
    }

    get snoopName() {
        if (this.mafiaImmune) {
            return "Gun (Associate)"
        } else if (this.cursed) {
            return "Gun (Cursed)"
        }

        return this.name;
    }
}