const Card = require("../../Card");

module.exports = class CardName extends Card {

	constructor(role) {
		super(role);

		this.meetingMods = {
			"*": {
				shouldMeet: function (meetingName) {
					if (meetingName == "Village" || meetingName == "Graveyard")
						return true;

					return (this.data[`meets:${meetingName}`] || 0) < 1;
				}
			}
		};
		this.listeners = {
			"meeting": function (meeting) {
				if (!meeting.members[this.player.id])
					return;

				if (!this.data[`meets:${meeting.name}`])
					this.data[`meets:${meeting.name}`] = 1;
				else
					this.data[`meets:${meeting.name}`]++;
			}
		};
	}

}