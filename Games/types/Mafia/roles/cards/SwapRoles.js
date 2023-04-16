const Card = require("../../Card");
const { PRIORITY_SWAP_ROLES } = require("../../const/Priority");

module.exports = class SwapRoles extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Swap Roles": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    labels: ["hidden", "convert"],
                    priority: PRIORITY_SWAP_ROLES,
                    run: function () {
                        if (!this.dominates()) {
                            return;
                        }
                        
                        var currRoleName = this.actor.role.name;
                        var currRoleModifier = this.actor.role.modifier;
                        var currRoleData = this.actor.role.data;

                        this.actor.setRole(`${this.target.role.name}:${this.target.role.modifier}`, this.target.role.data);
                        this.game.events.emit("rolesAssigned", this.actor);

                        this.target.setRole(`${currRoleName}:${currRoleModifier}`, currRoleData);
                        this.game.events.emit("rolesAssigned", this.target);
                    }
                }
            }
        };
    }

}