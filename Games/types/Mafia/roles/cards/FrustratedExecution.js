const Card = require("../../Card");
const Action = require("../../../../core/Action");

module.exports = class FrustratedExecution extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "lynch": function (meeting) {
                const votes = meeting.votes;
                let targeted = false;
                for (let key in votes){
                    let target = votes[key];
                    if (target === this.player.id){
                        targeted = true;
                        break;
                    }
                }
                if(targeted && meeting.finalTarget !== this.player){
                    let action = new Action({
                        actor: this.player,
                        target: this.player,
                        game: this.game,
                        labels: ["kill", "frustration", "hidden"],
                        power: 3,
                        run: function(){
                            this.game.sendAlert(`${this.target.name} feels immensely frustrated!`);
                            if (this.dominates())
                                this.target.kill("basic", this.actor);
                        }

                    });
                    action.do();
                }
            }
        };
    }

}
