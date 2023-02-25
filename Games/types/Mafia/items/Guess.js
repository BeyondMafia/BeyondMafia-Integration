const Item = require("../Item");

module.exports = class Guess extends Item {

    constructor() {
        super("Guess");
        
        this.cannotBeStolen = true;
    }


}
