const Card = require("../../Card");
const { PRIORITY_WIN_CHECK_DEFAULT } = require("../../const/Priority");

module.exports = class GiveTurkeyOnDeath extends Card {

    constructor(role) {
        super(role);
        
        let turkeyAlive = 0;
        this.listeners = {
            "rolesAssigned": function () {
                for (let player of this.game.players){
                    if (player.role.name === "Turkey"){
                        turkeyAlive += 1;
                    }
                    let items = player.items.map(a => a.name);
                    let breadCount = 0;
                    for (let item of items){
                        if (item == "Bread")
                            breadCount++;
                    }
                    while (breadCount <= 4){
                        player.holdItem("Bread");
                        breadCount++;
                    }
                    if(!player.hasEffect("Famished") && !player.role.name === "Turkey"){
                        player.giveEffect("Famished");
                    }
                }
            },
            "death": function (player, killer, deathType) {
                if (player == this.player){
                    this.game.queueAlert("The town cooks the Turkey and turns it into 2 meals for the entire town!");
                    for (let person of this.game.players){
                        person.holdItem("Turkey");
                        person.holdItem("Turkey");
                    }
                }
                if (player.role.name === "Turkey"){
                    turkeyAlive -= 1;
                }
            },
        };

        this.winCheck = {
            priority: PRIORITY_WIN_CHECK_DEFAULT,
            againOnFinished: true,
            check: function (counts, winners, aliveCount) {
                if (turkeyAlive == aliveCount) {
                    winners.addPlayer(this.player, this.name);
                }
            }
        };
        
    }

}