const Card = require("../../Card");
const { PRIORITY_REDIRECT_ACTION_CONTROL, PRIORITY_REDIRECT_ACTION_TARGET } = require("../../const/Priority");
const Player = require("../../../../core/Player");

module.exports = class RedirectAction extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Control Actor": {
                actionName: "Control",
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_REDIRECT_ACTION_CONTROL,
                    run: function () {
                        this.actor.role.data.controlledActor = this.target;
                    }
                }
            },
            "Redirect to Target": {
                actionName: "Redirect To",
                states: ["Night"],
                flags: ["voting", "mustAct"],
                targets: { include: ["alive"], exclude: [] },
                action: {
                    priority: PRIORITY_REDIRECT_ACTION_TARGET,
                    run: function () {
                        if (this.actor.role.data.controlledActor) {
                            for (let action of this.game.actions[0])
                                if (action.priority > this.priority &&
                                    !action.hasLabel("uncontrollable") &&
                                    action.actor == this.actor.role.data.controlledActor &&
                                    action.target instanceof Player)
                                    action.target = this.target;

                            delete this.actor.role.data.controlledActor;
                        }
                    }
                }
            }
        };
    }

}