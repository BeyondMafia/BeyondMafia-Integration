const Item = require("../Item");
const Action = require("../Action");
const Random = require("../../../../lib/Random");

module.exports = class HotPotato extends Item {

    constructor(killer) {
        super("Hot Potato");

        this.killer = killer;
        this.baseMeetingName = "Pass Hot Potato";
        this.currentMeetingIndex = 0;
        this.listeners = {
            "state": function (stateInfo) {
                if (!stateInfo.name.match(/Day/)) {
                    return
                }

                if (this.timer) {
                    return;
                }

                // potato detonates between 10 and 30 seconds
                let toDetonate = Random.randInt(10000, 30000);
                this.timer = setTimeout(() => {
                    if (!this.holder.alive) {
                        return
                    }
        
                    let action = new Action({
                        actor: this.killer,
                        target: this.holder,
                        game: this.holder.game,
                        labels: ["kill", "bomb"],
                        run: function () {
                            if (this.dominates())
                                this.target.kill("bomb", this.actor, true);
                        }
                    });
        
                    this.game.instantAction(action);
                }, toDetonate);
            }
        };

        this.potatoMeeting = {
            actionName: "Pass Hot Potato to",
            states: ["Day"],
            flags: ["voting", "instant", "noVeg"],
            targets: { include: ["alive"], exclude: ["self"] },
            action: {
                labels: ["giveItem", "bomb"],
                item: this,
                run: function () {
                    this.item.drop();
                    this.item.hold(this.target);
                    // increase meeting name index to ensure each meeting name is unique
                    delete this.item.meetings[this.item.getCurrentMeetingName()]
                    this.item.meetings[this.item.generateNextMeetingName()] = this.item.potatoMeeting;

                    this.game.instantMeeting(this.item.meetings, [this.target]);
                }
            }
        }

        this.meetings[this.getCurrentMeetingName()] = this.potatoMeeting;
    }

    getMeetingName(idx) {
        return `${this.baseMeetingName} ${idx}`;
    }

    getCurrentMeetingName() {
        return this.getMeetingName(this.currentMeetingIndex);
    }

    generateNextMeetingName() {
        this.currentMeetingIndex += 1
        return this.getCurrentMeetingName();
    }
};