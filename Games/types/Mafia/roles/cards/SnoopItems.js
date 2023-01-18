const Card = require("../../Card");
const { PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT } = require("../../const/Priority");

module.exports = class SnoopItems extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Snoop": {
                states: ["Night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT,
                    run: function() {
                        let items = this.target.items.map(a => a.name);
                        let alert = `You snoop on ${this.target.name}during the night and find they are carrying`
                        if (items.length) {
                            let count = {};
                            for (let item of items){
                                if (item in count){
                                    count[item] += 1;
                                }
                                else {
                                    count[item] = 1;
                                }
                            }
                            let result = ": ";
                            Object.keys(count).map(key => {
                                result += count[key] + " " + key + ", ";
                            });
                            alert += result.slice(0, -2) + '.';
                        } else {
                            alert += ' nothing.';
                        }
                        this.actor.queueAlert(alert);
                    }
                }
            }
        };
    }

}