const Item = require("../Item");

module.exports = class Challenge extends Item {

    constructor(reveal) {
        super("Challenge");

        this.reveal = reveal;
        this.lifespan = 1;
        this.cannotBeStolen = true;
    }
}
