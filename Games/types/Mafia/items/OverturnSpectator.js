const Item = require("../Item");

module.exports = class OverturnSpectator extends Item {

    constructor(reveal) {
        super("OverturnSpectator");

        this.reveal = reveal;
        this.lifespan = 1;
        this.meetings = {
            "Overturn Lynch": {
                states: ["Overturn"],
                flags: ["group", "speech", "voting"],
                canVote: false
            }
        };
    }
}