const Item = require("../Item");
const { PRIORITY_NIGHT_ROLE_BLOCKER } = require("../const/Priority");

module.exports = class Cat extends Item {

    constructor(owner) {
        super("Cat");
        this.owner = owner;
        this.lifespan = 1;

        this.meetings = {
            "Permit Cat": {
                actionName: "Do you let the cat in?",
                states: ["Night"],
                flags: ["voting"],
                inputType: "boolean",
                action: {
                    labels: ["investigate", "role", "block"],
                    priority: PRIORITY_NIGHT_ROLE_BLOCKER,
                    item: this,
                    run: function () {
                        if (this.target == "Yes") {
                            this.target = this.actor;
                            this.blockActions();                 
                        } else {
                            var role = this.actor.getAppearance("investigate", true);
                            this.item.owner.queueAlert(`You learn that ${this.actor.name}'s role is ${role}.`);
                        }
                        this.item.drop();
                    }
                }
            }
        }
    };
}
