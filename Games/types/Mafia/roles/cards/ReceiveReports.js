const Card = require("../../Card");
const { PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT } = require("../../const/Priority");

module.exports = class ReceiveReports extends Card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Receive Reports": {
                states: ["Night"],
                flags: ["voting"],
                targets: { include: ["alive"], exclude: ["self"] },
                action: {
                    labels: ["investigate", "alerts"],
                    priority: PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT + 1,
                    run: function () {
                        var reports = []

                        for (let alert of this.game.alertQueue) {
                            if (!alert.recipients) {
                                continue
                            }
                            
                            for (let recipient of alert.recipients) {
                                if (recipient == this.target) {
                                    reports.push(alert.message);
                                }
                            }
                        }

                        var alert = `You received all reports that ${this.target.name} received: (${reports.join(',\n')}).`;
                        this.actor.queueAlert(alert);
                    }
                }
            }
        };
    }
}
 