const Card = require("../../Card");
const Action = require("../../../../core/Action");

module.exports = class WinIfLynched extends Card {

    constructor(role) {
        super(role);

        this.listeners = {
            "lynch": function (meeting) {
                const votes = meeting.votes;
                let count = {}
                for (let key in votes){
                    let target = votes[key];
                    if (target in count)
                        count[target]++;
                    else
                        count[target] = 1;
                }
                if (this.player.id in count){
                    let playerVotes = count[this.player.id];
                    let max = true;
                    for (let playerId in count){
                        let numVotes = count[playerId];
                        if (numVotes > playerVotes)
                            max = false;
                    }
                    if(!max){
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
            }
        };
    }

}