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
                    if (this.game.getStateInfo().dayCount == 0) {
                        let mafia = this.game.players.filter(p => p.role.alignment == "Mafia");
                        var alert = `You know that ${mafia.join(', ')} are the Mafia.`;
                        this.actor.queueAlert(alert);
                        for (let player of mafia) {
                            player.holdItem("Guess");
                        }
                    }
                }
            }
        ];
    }
}
