const dotenv = require("dotenv").config();
const shortid = require("shortid");
const models = require("../db/models");
const sockets = require("../sockets");
const db = require("../db/db");
const redis = require("../redis");
const routeUtils = require("../routes/utils");
const constants = require("../constants");
const logger = require("../logging")("games");
const User = require("./core/User");

const serverId = Number(process.env.pm_id) || 0;
const ports = JSON.parse(process.env.GAME_PORTS);
const port = ports[serverId % ports.length];
const server = new sockets.SocketServer(port);

var games = {};

(async function() {
	try {
		await redis.registerGameServer(port);
		await db.promise;

		process
			.on("unhandledRejection", err => logger.error(err))
			.on("uncaughtException", err => logger.error(err))
			.on("exit", onClose)
			.on("SIGINT", onClose)
			.on("SIGUSR1", onClose)
			.on("SIGUSR2", onClose);

		clearBrokenGames();

		server.on("connection", socket => {
			try {
				var user;
	
				socket.send("connected");
	
				socket.on("auth", async token => {
					try {
						if (user) return;
	
						const userId = await redis.authenticateToken(String(token));
						if (!userId) return;
	
						user = await models.User.findOne({ id: userId, deleted: false })
							.select("id name avatar settings dev itemsOwned rankedCount stats playedGame referrer");
							
						if (!user) {
							user = null;
							return;
						}
	
						if (!(await routeUtils.verifyPermission(userId, "playGame"))) {
							socket.send("banned");
							socket.terminate();
							return;
						}
	
						user = user.toObject();
						user.socket = socket;
						user.settings = user.settings || {};
						user = new User(user);
	
						socket.send("authSuccess");
					}
					catch (e) {
						logger.error(e);
					}
				});
	
				socket.on("join", async (info) => {
					try {
						const gameId = String(info.gameId);
						const game = games[gameId];
						var isBot = false;

						if (!user && !game.guests)
							return;
						else if (!user) {
							var guestId = String(info.guestId).slice(0, 20);
							user = new User({ socket, guestId });
							isBot = true;
						}
	
						isBot = isBot || (user.dev && info.isBot);
	
						if (isBot) {
							user.id = shortid.generate();
							user.name = null;
							user.avatar = false;
						}
					
						if (!game || !await redis.gameExists(gameId)) {
							socket.send("error", "Unable to join game.");
							return;
						}

						if (game.scheduled) {
							if (Date.now() < game.scheduled) {
								socket.send("error", "Scheduled game has not started yet.");
								return;
							}
							else if (Date.now() < game.scheduled + constants.gameReserveTime) {
								var reservations = await redis.getGameReservations(gameId, 0, game.setup.total - game.players.length);

								if (reservations.indexOf(user.id) == -1) {
									socket.send("error", `All spots are currently filled or reserved. If the game does not fill soon then reservations will be released.`);
									return;
								}
								else
									await redis.unreserveGame(user.id, gameId);
							}
						}

						game.userJoin(user, isBot);
					}
					catch (e) {
						logger.error(e);
					}
				});
	
				// The main server authenticating as a server
				socket.on("authAsServer", async token => {
					try {
						if (token == process.env.LOAD_BALANCER_KEY)
							socket.isServer = true;
					}
					catch (e) {
						logger.error(e);
					}
				});
	
				// The main server attempting to create a game
				socket.on("createGame", async data => {
					try {
						if (!socket.isServer)
							throw new Error("Not authenticated as server");
	
						const Game = require(`./types/${data.gameType}/Game`);
	
						games[data.gameId] = new Game({
							id: data.gameId,
							hostId: data.hostId,
							port: port,
							settings: data.settings
						});
						await games[data.gameId].init();
	
						socket.send("gameCreated", data.gameId);
					}
					catch (e) {
						logger.error(e);
						socket.send("gameCreateError", { gameId: data.gameId, error: e.message });
					}
				});
	
				// The main server making a player leave a game
				socket.on("leaveGame", async data => {
					try {
						if (!socket.isServer)
							throw new Error("Not authenticated as server.");
	
						const gameId = await redis.inGame(data.userId);
						const game = games[gameId];
						
						if (!game)
							throw new Error(`User ${data.userId} unable to leave game ${gameId}.`);
	
						game.userLeave(data.userId);
						socket.send("gameLeft", data.userId);
					}
					catch(e) {
						logger.error(e);
						socket.send("gameLeaveError", { userId: data.userId, error: e.message });
					}
				});
	
				// The main cancelling a game
				socket.on("cancelGame", async data => {
					try {
						if (!socket.isServer)
							throw new Error("Not authenticated as server.");
	
						const game = games[data.gameId];
						
						if (!game)
							throw new Error(`Unable to cancel game ${gameId}.`);
	
						game.cancel();
						socket.send("gameLeft", data.userId);
					}
					catch(e) {
						logger.error(e);
						socket.send("gameLeaveError", { userId: data.userId, error: e.message });
					}
				});
			}
			catch (e) {
				logger.error(e);
			}
		});
	}
	catch(e) {
		logger.error(e);
	}
})();

async function onClose() {
	try {
		await redis.removeGameServer(port);
		await clearBrokenGames();
		await redis.client.quitAsync();
		process.exit();
	}
	catch(e) {
		logger.error(e);
	}
}

async function clearBrokenGames() {
	try {
		var existingGames = await redis.getAllGames();

		for (let game of existingGames) {
			if (game.port != port) continue;

			if (game.status == "Open")
				await redis.deleteGame(game.id);
			else
				await redis.breakGame(game.id);
		}
	}
	catch(e) {
		logger.error(e);
	}
}

module.exports = games;