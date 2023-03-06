const Card = require("../../Card");

module.exports = class AbsentMinded extends Card {

    constructor(role) {
      super(role);
      
      if (this.player.role.alignment == "Village") {
        this.player.data.appearAs = "Visitor";
      } else if (this.player.role.alignment == "Mafia") {
        this.player.data.appearAs = "Trespasser";
      }
      
      this.appearance = {
        self: this.player.data.appearAs
      };
      this.hideModifier = {
        self: true
      };
    }

}
