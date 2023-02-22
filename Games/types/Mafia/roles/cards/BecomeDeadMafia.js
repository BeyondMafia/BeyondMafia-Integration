const Card = require("../../Card");
const { PRIORITY_BECOME_DEAD_ROLE } = require("../../const/Priority");

module.exports = class BecomeDeadMafia extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Become Mafia": {
              actionName: "Become Role",
              states: ["Night"],
              flags: ["voting"],
              targets: { include: ["Mafia"], exclude: ["alive", "self"] },
              action: {
                priority: PRIORITY_BECOME_DEAD_ROLE,
                run: function () {
                  this.actor.setRole(`${this.target.role.name}:${this.target.role.modifier}`);
                }
              }
            }
        };
    }

}
