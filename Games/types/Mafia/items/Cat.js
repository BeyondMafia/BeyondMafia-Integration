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
                    labels: ["investigate", "role"],
                    item: this,
                    run: function () {
                      if (this.target == "Yes") {
                          this.holder.giveEffect("Daze", this.actor);
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
