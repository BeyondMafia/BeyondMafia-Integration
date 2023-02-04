const Card = require("../../Card");
const { PRIORITY_RECIEVE_REPORTS } = require("../../const/Priority")

module.exports = class RecieveReports extends card {

    constructor(role) {
        super(role);

        this.meetings = {
            "Receive Reports": {
                states: ["night"],
                flags: ["voting"],
                action: {
                    priority: PRIORITY_RECIEVE_REPORTS,
                    run: function () {
                        var allReports = [];
                        var allAlerts = this.game.states[this.game.currentState];

                        for (let alert in allAlerts) {
                            if (alert.recipients.includes(this.target)) {
                                allReports.push(alert.message)
                            }
                        }

                        if (allReports.length) == 0 {
                            this.game.QueueAlert("no reports")
                        } else {
                            var report = allReports.join('\n');
                            this.game.queueAlert(report...);
                        }
                        
                            }
                        }

                       
                    }
                }
            }

 