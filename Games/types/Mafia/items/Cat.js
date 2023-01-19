const Item = require("../Item");

module.exports = class Cat extends Item {

    constructor() {
        super("Cat");

        this.meetings = {
            "Permit Cat": {
                actionName: "Do you let the cat in?",
                states: ["Night"],
                flags: ["voting"],
                inputType: "boolean",
                action: {
                    labels: ["investigate", "role", "block"],
                    item: this,
                    run: function () {
                      if (this.target == "Yes") {
                        for (let action of this.game.actions[0]) {
                          if (
                            action.actor == this.holder &&
                            action.priority > this.priority &&
                            !action.hasLabel("absolute")
                          ) {
                            action.cancel(true);
                          }  
                        }
                      }
                      else  {
                        var role = this.holder.getAppearance("investigate", true);
                        var alert = `You learn that ${this.holder.name}'s role is ${role}.`;
                        var catLady = this.holder.role.data.catLady;
                        this.holder.role.data.catLady = null;
                        catLady.queueAlert(alert);
                      }
                      this.item.drop();
                        }
                    }
                }
            }
        };

    }
}
