module.exports = class User {

	constructor(props) {
		this.id = props.id;
		this.socket = props.socket;
		this.name = props.name;
		this.avatar = props.avatar;
		this.dev = props.dev;
		this.textColor = props.settings.textColor;
		this.nameColor = props.settings.nameColor;
		this.rankedCount = props.rankedCount;
		this.stats = props.stats;
		this.playedGame = props.playedGame;
		this.referrer = props.referrer;
		this.isBot = props.isBot;
	}

	send(eventName, data) {
		this.socket.send(eventName, data);
	}

}