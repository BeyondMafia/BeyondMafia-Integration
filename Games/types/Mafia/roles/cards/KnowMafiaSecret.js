const Card = require("../../Card");
const Random = require("../../../../../lib/Random");
const { PRIORITY_INVESTIGATIVE_DEFAULT } = require("../../const/Priority");

module.exports = class KnowMafiaSecret extends Card {

    constructor(role) {
        super(role);
        
        this.appearance = {
            death: "Villager",
        };
        
        this.actions = [
            {
                labels: ["knowledge"],
                priority: PRIORITY_INVESTIGATIVE_DEFAULT,
                run: function () {
                  let mafia = this.game.players.filter(p => p.role.alignment == "Mafia");
                  var alert = `You know that ${mafia.join(',\n')} are the Mafia.`;
                  if (this.game.getStateInfo().dayCount == 0) {
                    this.actor.queueAlert(alert);
                  }
                }
            }
        ];
    }
}
