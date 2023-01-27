const dotenv = require("dotenv").config();
const chai = require("chai"),
    should = chai.should();
const db = require("../../db/db");
const redis = require("../../modules/redis");
const shortid = require("shortid");
const Game = require("../../Games/types/Mafia/Game");
const User = require("../../Games/core/User");
const Socket = require("../../lib/sockets").TestSocket;

function makeUser() {
    return new User({
        id: shortid.generate(),
        socket: new Socket(),
        name: shortid.generate(),
        settings: {},
        isTest: true
    });
}

function makeUsers(amt) {
    var users = [];

    for (let i = 0; i < amt; i++)
        users.push(makeUser());

    return users;
}

async function makeGame(setup, stateLength) {
    stateLength = stateLength || 0;

    const users = makeUsers(setup.total);
    const game = new Game({
        id: shortid.generate(),
        hostId: users[0].id,
        settings: {
            setup: setup,
            stateLengths: {
                "Day": stateLength,
                "Night": stateLength
            },
            pregameCountdownLength: 0
        },
        isTest: true
    });

    await game.init();

    for (let user of users)
        await game.userJoin(user);

    return game;
}

function getRoles(game) {
    var roles = {};

    for (let player of game.players) {
        let roleName = player.role.name;

        if (!roles[roleName])
            roles[roleName] = player;
        else if (Array.isArray(roles[roleName]))
            roles[roleName].push(player);
        else {
            let existingPlayer = roles[roleName];
            roles[roleName] = [];
            roles[roleName].push(existingPlayer);
            roles[roleName].push(player);
        }
    }

    return roles;
}

function addListenerToPlayer(player, eventName, action) {
    player.user.socket.onClientEvent(eventName, action);
}

function addListenerToPlayers(players, eventName, action) {
    for (let player of players)
        addListenerToPlayer(player, eventName, action);
}

function addListenerToRoles(game, roleNames, eventName, action) {
    const players = game.players.filter(p => roleNames.indexOf(p.role.name) != -1);
    addListenerToPlayers(players, eventName, action);
}

function waitForResult(check) {
    return new Promise((resolve, reject) => {
        var interval = setInterval(() => {
            try {
                if (check()) {
                    clearInterval(interval);
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        }, 100);
    });
}

function waitForGameEnd(game) {
    return waitForResult(() => game.finished);
}

describe("Games/Mafia", function () {
    describe("Villager and Mafioso", function () {
        it("should make the village win when the mafia is lynched", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 2, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Mafia"]);
            should.exist(game.winners.groups["Village"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });

        it("should make the mafia win when the mafia outnumbers the village", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 2, "Mafioso": 1 }] };
            const game = await makeGame(setup);

            addListenerToRoles(game, ["Mafioso"], "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: meeting.targets[0],
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Village"]);
            should.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });

        it("should allow the game to continue after a death", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 4, roles: [{ "Villager": 3, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: meeting.targets[0],
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Mafia"]);
            should.exist(game.winners.groups["Village"]);
            game.winners.groups["Village"].should.have.lengthOf(3);
        });

        it("should still end with everyone AFK", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 2, "Mafioso": 1 }] };
            const game = await makeGame(setup);

            await waitForGameEnd(game);
        });
    });

    describe("Arms Dealer", function () {
        it("should make the village win when the mafia is shot", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Arms Dealer": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Give Gun") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Shoot Gun") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Mafia"]);
            should.exist(game.winners.groups["Village"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Chemist", function () {
        it("should kill a villager with poison and make the mafia win", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 2, "Chemist": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Poison") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"][0].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });
    });

    describe("Jester", function () {
        it("should make ony the Jester win when he is lynched", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Jester": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Jester"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Jester"]);
            should.not.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Jester"].should.have.lengthOf(1);
        });
    });

    describe("Lycan", function () {
        it("should make the Monsters win when a werewolf kills someone", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 2, "Lycan": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Wolf Bite") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"][0].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Monsters"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Monsters"].should.have.lengthOf(1);
        });

        it("should make the Lycan invincible during a full moon", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Lycan": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Wolf Bite") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Mafia" && game.stateEvents["Full Moon"]) {
                    this.sendToServer("vote", {
                        selection: roles["Lycan"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Monsters"]);
            should.not.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Monsters"].should.have.lengthOf(1);
        });
    });

    describe("Bomb", function () {
        it("should make the mafia die when the bomb is killed", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Bomb": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Bomb"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Doctor", function () {
        it("should save the villager from dying", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Doctor": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Save") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Agent and Spy", function () {
        it("should make the Village win when the Spy is guessed", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Agent": 1, "Spy": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Guess Adversary") {
                    this.sendToServer("vote", {
                        selection: roles["Spy"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });

        it("should make the Mafia win when the Agent is guessed", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Agent": 1, "Spy": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name != "Guess Adversary") {
                    this.sendToServer("vote", {
                        selection: roles["Agent"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });
    });

    describe("Medic", function () {
        it("should save self from dying", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Medic": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Medic"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Save") {
                    this.sendToServer("vote", {
                        selection: roles["Medic"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Escort", function () {
        it("should block the Mafia kill", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Escort": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Block") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Serial Killer and Vigilante", function () {
        it("should make the Mafioso win when the Serial Killer and Vigilante kill each other", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Vigilante": 1, "Serial Killer": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Solo Kill") {
                    if (meeting.members[0].id == roles["Serial Killer"].id) {
                        this.sendToServer("vote", {
                            selection: roles["Vigilante"].id,
                            meetingId: meeting.id
                        });
                    }
                    else {
                        this.sendToServer("vote", {
                            selection: roles["Serial Killer"].id,
                            meetingId: meeting.id
                        });
                    }
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Serial Killer"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });
    });

    describe("Witch", function () {
        it("should redirect the mafia kill from the Witch to the Villager", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Witch": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Witch"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Control Actor") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Redirect to Target") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.exist(game.winners.groups["Monsters"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
            game.winners.groups["Monsters"].should.have.lengthOf(1);
        });
    });

    describe("Driver", function () {
        it("should drive the Mafia kill to the Mafioso", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 2, "Driver": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"][0].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Destination A") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"][0].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Destination B") {
                    this.sendToServer("vote", {
                        selection: roles["Driver"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Monkey", function () {
        it("should make the Monkey get blown up by the bomb", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Bomb": 1, "Monkey": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Bomb"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Steal Actions") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });
    });

    describe("Knight", function () {
        it("should prevent the Knight from being killed by the Mafia", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Knight": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Knight"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });

        it("should kill the Knight after two nights", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Knight": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Knight"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });
    });

    describe("Blacksmith", function () {
        it("should prevent the person with armor from dying", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Blacksmith": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Give Armor") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Babushka", function () {
        it("should kill the Mafioso upon visit", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Babushka": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Babushka"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            roles["Babushka"].alive.should.be.true;
            game.winners.groups["Village"].should.have.lengthOf(2);
        });

        it("should save the Mafioso from dying and lynch the Babushka", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Doctor": 1, "Babushka": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Babushka"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Save") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Babushka"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });
    });

    describe("Archer", function () {
        it("should kill the Mafioso when the Archer is lynched", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Archer": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Archer"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Get Revenge") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
            game.winners.groups["Village"].should.have.lengthOf(2);
        });
    });

    describe("Survivor", function () {
        it("should win when alive among winning team", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Survivor": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Village"]);
            should.exist(game.winners.groups["Mafia"]);
            should.exist(game.winners.groups["Survivor"]);
            game.winners.groups["Survivor"].should.have.lengthOf(1);
        });

        it("should win when last alive", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Serial Killer": 1, "Survivor": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Serial Killer"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Solo Kill") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Serial Killer"]);
            should.not.exist(game.winners.groups["Mafia"]);
            should.exist(game.winners.groups["Survivor"]);
            game.winners.groups["Survivor"].should.have.lengthOf(1);
        });

        it("should not win when dead", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Survivor": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Survivor"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Survivor"]);
            should.exist(game.winners.groups["Mafia"]);
        });
    });

    describe("Priest", function () {
        it("should kill the Lycan upon visiting the Priest", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Priest": 1, "Lycan": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Wolf Bite") {
                    this.sendToServer("vote", {
                        selection: roles["Priest"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Monsters"]);
            should.exist(game.winners.groups["Village"]);
        });
    });

    describe("Mason", function () {
        it("should win upon converting the Serial Killer", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Mason": 2, "Serial Killer": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Masons") {
                    this.sendToServer("vote", {
                        selection: roles["Serial Killer"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Serial Killer"]);
            should.exist(game.winners.groups["Village"]);
        });

        it("should lose upon trying to convert the Mafioso", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Mason": 2, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Masons") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Village"]);
            should.exist(game.winners.groups["Mafia"]);
        });
    });

    describe("Cultist", function () {
        it("should kill all Cultists if the leader dies", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 5, roles: [{ "Villager": 4, "Cultist": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Cultists") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"][0].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Village") {
                    this.sendToServer("vote", {
                        selection: roles["Cultist"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.not.exist(game.winners.groups["Monsters"]);
            should.exist(game.winners.groups["Village"]);
        });
    });

    describe("Jailer", function () {
        it("should jail and kill the Mafia", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Jailer": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Jail Target") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Jail") {
                    this.sendToServer("vote", {
                        selection: "Yes",
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Village"]);
            should.not.exist(game.winners.groups["Mafia"]);
        });
    });

    describe("Alien", function () {
        it("should win when all other alive players are probed", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Alien": 1, "Mafioso": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Mafia") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Probe") {
                    this.sendToServer("vote", {
                        selection: roles["Mafioso"].id,
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Alien"]);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Town"]);
            game.winners.players.should.have.lengthOf(2);
        });
    });

    describe("Associate", function () {
        it("should make the Mafia win when the Village is shot", async function () {
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = { total: 3, roles: [{ "Villager": 1, "Archer": 1, "Associate": 1 }] };
            const game = await makeGame(setup);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function (meeting) {
                if (meeting.name == "Give Gun") {
                    this.sendToServer("vote", {
                        selection: roles["Archer"].id,
                        meetingId: meeting.id
                    });
                }
                else if (meeting.name == "Shoot Gun") {
                    this.sendToServer("vote", {
                        selection: roles["Villager"].id,
                        meetingId: meeting.id
                    });
                }
                else {
                    this.sendToServer("vote", {
                        selection: "*",
                        meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            should.exist(game.winners.groups["Mafia"]);
            should.not.exist(game.winners.groups["Village"]);
            game.winners.groups["Mafia"].should.have.lengthOf(1);
        });
    });

    describe("Loudmouth", function() {
        it("should shout visitors when LM is visited during the night", async function(){
            await db.promise;
            await redis.client.flushdbAsync();

            const setup = {total: 3, roles: [{"Seer": 1, "Mafioso": 1, "Loudmouth": 1}]};
            const game = await makeGame(setup, 3);
            const roles = getRoles(game);

            addListenerToPlayers(game.players, "meeting", function(meeting){
                if(meeting.name == "Learn Role"){
                    this.sendToServer("vote", {
                        selection: roles["Loudmouth"].id,
                        meetingId: meeting.id
                    });
                }
                else{
                    this.sendToServer("vote", {
                       selection: "*",
                       meetingId: meeting.id
                    });
                }
            });

            await waitForGameEnd(game);
            Object.values(game.history.states).flatMap(m => m.alerts).some(c => c.content.includes("Curses!")).should.be.true;
        });
    });
});