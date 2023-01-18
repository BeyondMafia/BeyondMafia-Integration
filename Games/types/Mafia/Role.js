const Role = require("../../core/Role");

module.exports = class MafiaRole extends Role {

    constructor(name, player, data) {
        super(name, player, data);

        this.appearance = {
            self: "real",
            reveal: "real",
            lynch: "real",
            death: "real",
            investigate: "real"
        };
    }

} 