const Item = require("../Item");
const Random = require("../../../../lib/Random");

module.exports = class Gun extends Item {

    constructor(reveal) {
        super("Gun");

        this.reveal = reveal;
        this.meetings = {
            "Shoot Gun": {
                actionName: "Shoot",
                states: [STATE_DAY],
                flags: [FLAG_VOTING, FLAG_INSTANT, FLAG_NO_VEG],
                action: {
                    labels: [LABEL_KILL, LABEL_GUN],
                    item: this,
                    run: function () {
                        var reveal = this.item.reveal;

                        if (reveal == null)
                            reveal = Random.randArrayVal([true, false]);

                        if (reveal)
                            this.game.queueAlert(`${this.actor.name} pulls a gun and shoots at ${this.target.name}!`);
                        else
                            this.game.queueAlert(`Someone fires a gun at ${this.target.name}!`);

                        if (this.dominates())
                            this.target.kill(DEATH_TYPE_GUN, this.actor, true);

                        this.item.drop();
                        this.game.broadcast("gunshot");
                    }
                }
            }
        };
    }

}
