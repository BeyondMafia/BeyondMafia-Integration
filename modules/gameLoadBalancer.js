const shortid = require("shortid");
const sockets = require("../lib/sockets");
const redis = require("./redis");
const logger = require("./logging")(".");

var gameServerPorts = [];
var servers = {};
var waiting = {};

(async function () {
	try {
		gameServerPorts = await redis.getAllGameServerPorts();

		for (let i = 0; i < gameServerPorts.length; i++) {
			let port = gameServerPorts[i];
			let socket = new sockets.ClientSocket(`ws://localhost:${port}`, true);

			servers[port] = socket;

			socket.on("connected", () => {
				socket.send("authAsServer", process.env.LOAD_BALANCER_KEY);
			});

			socket.on("gameCreated", gameId => {
				const gameResults = waiting[gameId];
				if (!gameResults) return;

				delete waiting[gameId];
				gameResults.resolve(gameId);
			});

			socket.on("gameCreateError", info => {
				const gameResults = waiting[info.gameId];
				if (!gameResults) return;

				delete waiting[info.gameId];
				gameResults.reject(new Error(info.error));
			});

			socket.on("gameLeft", userId => {
				const leaveResults = waiting[userId];
				if (!leaveResults) return;

				delete waiting[userId];
				leaveResults.resolve();
			});

			socket.on("gameLeaveError", info => {
				const leaveResults = waiting[info.userId];
				if (!leaveResults) return;

				delete waiting[info.userId];
				leaveResults.reject(new Error(info.error));
			});
		}
	}
	catch (e) {
		logger.error(e);
	}
})();

function createGame(hostId, gameType, settings) {
	return new Promise(async (res, rej) => {
		try {
			const gameId = shortid.generate();
			const portForNextGame = await redis.getNextGameServerPort();

			waiting[gameId] = {
				resolve: res,
				reject: rej
			};

			servers[portForNextGame].send("createGame", {
				gameId: gameId,
				key: process.env.LOAD_BALANCER_KEY,
				hostId: hostId,
				gameType: gameType,
				settings: settings
			});

			setTimeout(() => {
				if (!waiting[gameId])
					return;

				rej(new Error("Timeout creating game on game server"));
				delete waiting[gameId];
			}, Number(process.env.GAME_CREATION_TIMEOUT));
		}
		catch (e) {
			logger.error(e);
			rej(e);
		}
	});
}

async function leaveGame(userId) {
	return new Promise(async (res, rej) => {
		try {
			const gameId = await redis.inGame(userId);

			if (!gameId) {
				res();
				return;
			}

			const port = await redis.getGamePort(gameId);

			if (!port) {
				res();
				return;
			}

			waiting[userId] = {
				resolve: res,
				reject: rej
			};

			servers[port].send("leaveGame", {
				userId: userId,
				key: process.env.LOAD_BALANCER_KEY
			});
		}
		catch (e) {
			logger.error(e);
			rej(e);
		}
	});
}

async function cancelGame(userId, gameId) {
	return new Promise(async (res, rej) => {
		try {
			const port = await redis.getGamePort(gameId);

			waiting[userId] = {
				resolve: res,
				reject: rej
			};

			servers[port].send("cancelGame", {
				gameId: gameId,
				userId: userId,
				key: process.env.LOAD_BALANCER_KEY
			});
		}
		catch (e) {
			logger.error(e);
			rej(e);
		}
	});
}

module.exports = {
	createGame,
	leaveGame,
	cancelGame
};