const Card = require("../../Card");
const { PRIORITY_SWAP_ROLES } = require("../../const/Priority");

module.exports = class SwapRoles extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Swap Roles": {
                states: ["Night"],
                flags: ["voting", "hidden", "absolute"],
                action: {
                    priority: PRIORITY_SWAP_ROLES,
                    run: function () {
                        var currRoleName = this.actor.role.name;
                        var currRoleModifier = this.actor.role.modifier;
                        var currRoleData = this.actor.role.data;
                        this.actor.setRole(`${this.target.role.name}:${this.target.role.modifier}`, this.target.role.data);
                        this.target.setRole(`${currRoleName}:${currRoleModifier}`, currRoleData);
                    }
                }
            }
        };
    }

}