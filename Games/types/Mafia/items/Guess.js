const Item = require("../Item");

module.exports = class Guess extends Item {

    constructor(reveal) {
        super("Guess");

        this.reveal = reveal;
        this.lifespan = 1;
        this.cannotBeStolen = true;

        this.meetings = {
            "Guess Merlin": {
                actionName: "Guess",
                states: ["Night"],
                flags: ["group", "voting"],
                run: function () {
                  if this.target.role == "Merlin" {
                    return this.holder.data.guessedMerlin = true;
                  }
                }
            }
        };
    }
}
