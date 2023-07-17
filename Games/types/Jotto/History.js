const History = require("../../core/History");
const logger = require("../../../modules/logging")("games");

module.exports = class JottoHistory extends History {

    constructor(game, player) {
        super(game, player);
        this.states = {
            [-1]: {
                name: "Pregame",
                meetings: {},
                alerts: [],
                stateEvents: {},
                roles: {},
                deaths: {},
                extraInfo: {
                    guesses: {},
                    chosenWords: {},
                    opponents: {},
                },
            }
        };
    }

    addState(name, state) {
        state = state == null ? this.game.currentState : state;
        var prevState;

        if (state != -2)
            prevState = state - 1;
        else
            prevState = Object.keys(this.states).sort((a, b) => b - a)[0];

        this.states[state] = {
            name: name,
            meetings: {},
            alerts: [],
            stateEvents: {},
            roles: { ...this.states[prevState].roles },
            deaths: { ...this.states[prevState].deaths },
            extraInfo: {
                guesses: { ...this.states[prevState].extraInfo.guesses },
                chosenWords: { ...this.states[prevState].extraInfo.chosenWords },
                opponents: { ...this.states[prevState].extraInfo.opponents },
            },
        };
    }

    addStateExtraInfo(extraInfo, state) {
        state = state == null ? this.game.currentState : state;
        state = this.states[state];

        state.extraInfo = {...state.extraInfo, ...extraInfo};
    }

    recordGuess(player) {
        let state = this.game.currentState;
        this.states[state].extraInfo.guesses[player.id] = [...this.game.players[player.id].role.guesses];
    }

    recordAllGuesses() {
        let state = this.game.currentState;

        for (let player of this.game.players)
            if (player.role.guesses)
                this.states[state].extraInfo.guesses[player.id] = [...player.role.guesses];
    }

    recordChosenWord(player, word) {
        let state = this.game.currentState;
        this.states[state].extraInfo.chosenWords[player.id] = word;
    }

    recordAllChosenWords() {
        let state = this.game.currentState;

        for (let player of this.game.players)
            if (player.role.chosenWord)
                this.states[state].extraInfo.chosenWords[player.id] = player.role.chosenWord;
    }

    recordOpponents(player, attackerId, targetId) {
        let state = this.game.currentState;
        this.states[state].extraInfo.opponents[player.id] = { attackerId: attackerId, targetId: targetId };
    }

    recordAllOpponents() {
        let state = this.game.currentState;

        for (let player of this.game.players)
            if (player.role.attackerId && player.role.targetId)
                this.states[state].extraInfo.opponents[player.id] = { attackerId: player.role.attackerId, targetId: player.role.targetId };
    }
}