const Item = require("../Item");

module.exports = class Challenge extends Item {

    constructor() {
        super("Challenge");
        
        this.lifespan = 1;
        this.cannotBeStolen = true;
    }
}
