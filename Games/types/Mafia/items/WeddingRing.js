const Item = require("../Item");

module.exports = class WeddingRing extends Item {

    constructor(proposer, meetingName) {
        super("Wedding Ring");

        this.proposer = proposer;
        this.meetings[meetingName] = {
            meetingName: "Accept Proposal",
            states: ["Day"],
            flags: ["voting", "instant"],
            inputType: "boolean",
            action: {
                labels: ["marriage"],
                item: this,
                run: function() {
                    var isAccepted = "rejected";
                    if (this.target == "Yes") {
                        isAccepted = "accepted";

                        if (!this.item.proposer.alive) {
                            this.actor.role.revealToAll();
                            this.game.queueAlert(`${this.actor.name} weeps at the dead bride.`);
                            return;
                        }
                        
                        this.item.proposer.role.data.isMarried = true;
                        this.item.proposer.role.revealToAll();
                        this.actor.role.revealToAll();
                    }

                    this.game.queueAlert(`${this.actor.name} ${isAccepted} the proposal.`)
                    this.item.drop();
                }
            }
        };
    }
}