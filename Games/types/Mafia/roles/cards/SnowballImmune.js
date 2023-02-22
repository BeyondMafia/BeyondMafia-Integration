const Card = require("../../Card");

module.exports = class KillImmune extends Card {

    constructor(role) {
        super(role);

        this.immunity.throw = 1;
    }

}