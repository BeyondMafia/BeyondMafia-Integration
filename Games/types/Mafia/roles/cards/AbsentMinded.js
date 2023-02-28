const Card = require("../../Card");

module.exports = class AbsentMinded extends Card {

    constructor(role) {
      super(role);
      
      if (this.player.role.alignment == "Village") {
        this.player.data.perception = "Visitor";
      } else if (this.player.role.alignment == "Mafia") {
        this.player.data.perception = "Trespasser";
      }
      
      this.appearance = {
        self: this.player.data.perception
      };
      this.hideModifier = {
        self: true
      };
    }

}
