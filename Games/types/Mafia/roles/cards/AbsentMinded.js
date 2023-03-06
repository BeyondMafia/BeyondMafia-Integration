const Card = require("../../Card");

module.exports = class AbsentMinded extends Card {

    constructor(role) {
      super(role);
      
      if (this.player.role.alignment == "Village") {
        this.player.data.selfPerception = "Visitor";
      } else if (this.player.role.alignment == "Mafia") {
        this.player.data.selfPerception = "Trespasser";
      }
      
      this.appearance = {
        self: this.player.data.selfPerception
      };
      this.hideModifier = {
        self: true
      };
    }

}
