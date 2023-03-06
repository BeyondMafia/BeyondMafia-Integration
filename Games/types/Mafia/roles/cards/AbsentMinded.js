const Card = require("../../Card");

module.exports = class AbsentMinded extends Card {

    constructor(role) {
      super(role);
      
      if (this.player.role.alignment == "Village") {
          this.player.data.character = "Visitor";
          this.player.data.plain = true;
      } else if (this.player.role.alignment == "Mafia") {
          this.player.data.character = "Trespasser";
          this.player.data.plain = true;
      } else {
          this.player.data.character = "real";
          this.player.data.plain = false;
      }
      
      this.appearance = {
          self: this.player.data.character
      };
      this.hideModifier = {
          self: this.player.data.plain
      };
    }

}
