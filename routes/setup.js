const express = require("express");
const shortid = require("shortid");
const oHash = require("object-hash");
const models = require("../db/models");
const routeUtils = require("./utils");
const constants = require("../data/constants");
const roleData = require("../data/roles");
const redis = require("../modules/redis");
const logger = require("../modules/logging")(".");
const utils = require("./utils");
const router = express.Router();

function markFavSetups(userId, setups) {
    return new Promise(async (resolve, reject) => {
        try {
            if (userId) {
                var favSetups = await redis.getFavSetupsHashtable(userId);

                for (let i in setups) {
                    if (favSetups[setups[i].id]) {
                        let setup = setups[i].toJSON();
                        setup.favorite = true;
                        setups[i] = setup;
                    }
                }
            }

            resolve();
        }
        catch (e) {
            reject(e);
        }
    });
}

router.get("/id", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req, true);
        var setup = await models.Setup.findOne({ id: String(req.query.query) })
            .select("id gameType name roles closed count -_id");
        var setups = setup ? [setup] : [];

        await markFavSetups(userId, setups);
        res.send({ setups: setups, pages: 0 });
    }
    catch (e) {
        logger.error(e);
        res.send({ setups: [], pages: 0 });
    }
});

router.get("/featured", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req, true);
        var gameType = String(req.query.gameType);
        var pageSize = 7;
        var pageLimit = 10;
        var start = ((Number(req.query.page) || 1) - 1) * pageSize;
        var setupLimit = pageSize * pageLimit;

        if (!utils.verifyGameType(gameType)) {
            res.send({ setups: [], pages: 0 });
            return;
        }

        if (start < setupLimit) {
            var setups = await models.Setup.find({ featured: true, gameType })
                .skip(start)
                .limit(pageSize)
                .select("id gameType name roles closed count featured -_id");
            var count = await models.Setup.countDocuments({ featured: true, gameType });

            await markFavSetups(userId, setups);
            res.send({ setups: setups, pages: Math.min(Math.ceil(count / pageSize), pageLimit) || 1 });
        }
        else
            res.send({ setups: [], pages: 0 });
    }
    catch (e) {
        logger.error(e);
        res.send({ setups: [], pages: 0 });
    }
});

router.get("/popular", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req, true);
        var gameType = String(req.query.gameType);
        var pageSize = 7;
        var pageLimit = 10;
        var start = ((Number(req.query.page) || 1) - 1) * pageSize;
        var setupLimit = pageSize * pageLimit;

        if (!utils.verifyGameType(gameType)) {
            res.send({ setups: [], pages: 0 });
            return;
        }

        if (start < setupLimit) {
            var setups = await models.Setup.find({ gameType })
                .sort("played")
                .skip(start)
                .limit(pageSize)
                .select("id gameType name roles closed count featured -_id");
            var count = await models.Setup.countDocuments({ gameType });

            await markFavSetups(userId, setups);
            res.send({ setups: setups, pages: Math.min(Math.ceil(count / pageSize), pageLimit) || 1 });
        }
        else
            res.send({ setups: [], pages: 0 });
    }
    catch (e) {
        logger.error(e);
        res.send({ setups: [], pages: 0 });
    }
});

router.get("/ranked", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req, true);
        var gameType = String(req.query.gameType);
        var pageSize = 7;
        var pageLimit = 10;
        var start = ((Number(req.query.page) || 1) - 1) * pageSize;
        var setupLimit = pageSize * pageLimit;

        if (!utils.verifyGameType(gameType)) {
            res.send({ setups: [], pages: 0 });
            return;
        }

        if (start < setupLimit) {
            var setups = await models.Setup.find({ ranked: true, gameType })
                .skip(start)
                .limit(pageSize)
                .select("id gameType name roles closed count featured -_id");
            var count = await models.Setup.countDocuments({ gameType });

            await markFavSetups(userId, setups);
            res.send({ setups: setups, pages: Math.min(Math.ceil(count / pageSize), pageLimit) || 1 });
        }
        else
            res.send({ setups: [], pages: 0 });
    }
    catch (e) {
        logger.error(e);
        res.send({ setups: [], pages: 0 });
    }
});

router.get("/favorites", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req, true);
        var gameType = String(req.query.gameType);
        var pageSize = 7;
        var pageLimit = 10;
        var start = ((Number(req.query.page) || 1) - 1) * pageSize;
        var setupLimit = pageSize * pageLimit;

        if (!utils.verifyGameType(gameType)) {
            res.send({ setups: [], pages: 0 });
            return;
        }

        if (userId && start < setupLimit) {
            var user = await models.User.findOne({ id: userId, deleted: false })
                .select("favSetups")
                .populate({
                    path: "favSetups",
                    select: "id gameType name roles closed count featured -_id",
                    options: { limit: setupLimit }
                });

            if (user) {
                var setups = user.favSetups.filter(s => s.gameType == gameType);
                var count = setups.length;
                setups = setups.reverse().slice(start, start + pageSize);

                await markFavSetups(userId, setups);
                res.send({ setups: setups, pages: Math.min(Math.ceil(count / pageSize), pageLimit) || 1 });
            }
            else
                res.send({ setups: [], pages: 0 });
        }
        else
            res.send({ setups: [], pages: 0 });
    }
    catch (e) {
        logger.error(e);
        res.send({ setups: [], pages: 0 });
    }
});

router.get("/yours", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var gameType = String(req.query.gameType);
        var pageSize = 7;
        var start = ((Number(req.query.page) || 1) - 1) * pageSize;
        var setupLimit = constants.maxOwnedSetups;
        var pageLimit = Math.ceil(setupLimit / pageSize);

        if (!utils.verifyGameType(gameType)) {
            res.send({ setups: [], pages: 0 });
            return;
        }

        if (userId) {
            var user = await models.User.findOne({ id: userId, deleted: false })
                .select("setups")
                .populate({
                    path: "setups",
                    select: "id gameType name roles closed count featured -_id",
                    options: { limit: setupLimit }
                });

            if (user) {
                var setups = user.setups.filter(s => s.gameType == gameType);
                var count = setups.length;
                setups = setups.reverse().slice(start, start + pageSize);

                await markFavSetups(userId, setups);
                res.send({ setups: setups, pages: Math.min(Math.ceil(count / pageSize), pageLimit) });
            }
            else
                res.send({ setups: [], pages: 0 });
        }
        else
            res.send({ setups: [], pages: 0 });
    }
    catch (e) {
        logger.error(e);
        res.send({ setups: [], pages: 0 });
    }
});

router.get("/search", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var userId = await routeUtils.verifyLoggedIn(req, true);
        var gameType = String(req.query.gameType);
        var pageSize = 7;
        var pageLimit = 5;
        var start = ((Number(req.query.page) || 1) - 1) * pageSize;
        var setupLimit = pageSize * pageLimit;

        if (!utils.verifyGameType(gameType)) {
            res.send({ setups: [], pages: 0 });
            return;
        }

        if (start < setupLimit) {
            var setups = await models.Setup.find({ name: { $regex: String(req.query.query), $options: "i" }, gameType })
                .sort("played")
                .limit(setupLimit)
                .select("id gameType name roles closed count featured -_id");
            var count = setups.length;
            setups = setups.slice(start, start + pageSize);

            await markFavSetups(userId, setups);
            res.send({ setups: setups, pages: Math.min(Math.ceil(count) / pageSize, pageLimit) || 1 });
        }
        else
            res.send({ setups: [], pages: 0 });
    }
    catch (e) {
        logger.error(e);
        res.send({ setups: [], pages: 0 });
    }
});

router.get("/:id", async function (req, res) {
    res.setHeader("Content-Type", "application/json");
    try {
        var setup = await models.Setup.findOne({ id: req.params.id })
            .select("-_id -__v -hash")
            .populate("creator", "id name avatar tag -_id");

        if (setup) {
            setup = setup.toJSON();
            res.send(setup);
        }
        else {
            res.status(500);
            res.send("Unable to find setup.");
        }
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Unable to find setup.");
    }
});

router.post("/feature", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var setupId = String(req.body.setupId);

        if (!(await routeUtils.verifyPermission(res, userId, "featureSetup")))
            return;

        var setup = await models.Setup.findOne({ id: setupId });

        if (!setup) {
            res.status(500);
            res.send("Setup not found.");
            return;
        }

        await models.Setup.updateOne({ id: setupId }, { featured: !setup.featured }).exec();
        res.sendStatus(200);
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error featuring setup.");
    }
});

router.post("/ranked", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var setupId = String(req.body.setupId);

        if (!(await routeUtils.verifyPermission(res, userId, "approveRanked")))
            return;

        var setup = await models.Setup.findOne({ id: setupId });

        if (!setup) {
            res.status(500);
            res.send("Setup not found.");
            return;
        }

        await models.Setup.updateOne({ id: setupId }, { ranked: !setup.ranked }).exec();

        routeUtils.createModAction(userId, "Toggle Ranked Setup", [setupId]);
        res.sendStatus(200);
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error making setup ranked.");
    }
});

router.post("/favorite", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var setupId = String(req.body.id);

        if (!(await routeUtils.rateLimit(userId, "favSetup", res)))
            return;

        var result = await redis.updateFavSetup(userId, setupId);

        if (result != "-2")
            res.send(result);
        else {
            res.status(500);
            res.send("You may only favorite a maximum of 100 setups.");
        }
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error favoriting setup.");
    }
});

router.post("/delete", async function (req, res) {
    try {
        var userId = await routeUtils.verifyLoggedIn(req);
        var user = await models.User.findOne({ id: userId, deleted: false })
            .select("_id");
        var setup = await models.Setup.findOne({ id: String(req.body.id) })
            .select("_id creator");

        if (setup && user && setup.creator && setup.creator.toString() == user._id.toString()) {
            await models.User.updateOne({ id: userId }, { $pull: { setups: setup._id } }).exec();
            await models.Setup.updateOne({ id: String(req.body.id), creator: user._id }, { $unset: { creator: "" } }).exec();
            res.send("1");
        }
        else {
            res.status(500);
            res.send("You are not the owner of this setup.");
        }
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Error deleting setup");
    }
});

router.post("/create", async function (req, res) {
    try {
        const userId = await routeUtils.verifyLoggedIn(req);

        var user = await models.User.findOne({ id: userId, deleted: false })
            .select("setups");
        user = user.toJSON();

        if (user.setups.length >= constants.maxOwnedSetups) {
            res.status(500);
            res.send("You can only have up to 100 created setups linked to your account.");
            return;
        }

        if (req.body.editing) {
            var setup = await models.Setup.findOne({ id: String(req.body.id) })
                .select("creator")
                .populate("creator", "id");

            if (!setup || setup.creator.id != userId) {
                res.status(500);
                res.send("You can only edit setups you have created.");
                return;
            }
        }

        var setup = Object(req.body);
        setup.gameType = String(setup.gameType);
        setup.name = String(setup.name || "");
        setup.roles = Object(setup.roles);
        setup.count = Object(setup.count);
        setup.closed = Boolean(setup.closed);
        setup.unique = setup.closed ? Boolean(setup.unique) : false;
        setup.startState = String(setup.startState || constants.startStates[setup.gameType][0]);
        setup.whispers = Boolean(setup.whispers);
        setup.leakPercentage = Number(setup.leakPercentage);
        setup.dawn = Boolean(setup.dawn);
        setup.mustAct = Boolean(setup.mustAct);

        if (!routeUtils.validProp(setup.gameType) || constants.gameTypes.indexOf(setup.gameType) == -1) {
            res.status(500);
            res.send("Invalid game type.");
            return;
        }

        if (!setup.name || !setup.name.length) {
            res.status(500);
            res.send("You must give your setup a name.");
            return;
        }

        var [result, newRoles, newCount, newTotal] = verifyRolesAndCount(setup);

        if (result != true) {
            if (result == "Invalid role data")
                logger.warn(`Bad role data: \n${userId}\n${JSON.stringify(setup.roles)}`);

            res.status(500);
            res.send(result);
            return;
        }

        if (setup.gameType == "Mafia" && newTotal < constants.minMafiaSetupTotal) {
            res.status(500);
            res.send(`Mafia setups must have at least ${constants.minMafiaSetupTotal} players.`);
            return;
        }

        setup.roles = newRoles;
        setup.count = newCount;
        setup.total = newTotal;

        var gameTypeOptions = optionsChecks[setup.gameType](setup);

        if (typeof gameTypeOptions == "string") {
            res.status(500);
            res.send(gameTypeOptions);
            return;
        }

        setup = {
            ...setup,
            ...gameTypeOptions
        }

        //Check whisper leak rate
        if (setup.whispers) {
            if (setup.leakPercentage < 0 || setup.leakPercentage > 100) {
                res.status(500);
                res.send("Leak percentage must be between 0% and 100%.");
                return;
            }
        }

        //Check starting state
        if (constants.startStates[setup.gameType].indexOf(setup.startState) == -1) {
            res.status(500);
            res.send("Invalid starting state.");
            return;
        }

        //Verify unique hash and save
        var obj = {
            ...setup,
            roles: JSON.stringify(setup.roles),
            count: JSON.stringify(setup.count),
        };

        const hash = oHash(obj);
        const existingSetup = await models.Setup.findOne({ hash });

        if (existingSetup && (!req.body.editing || existingSetup.id != req.body.id)) {
            res.status(500);
            res.send(`Setup already exists: "${existingSetup.name}".`);
            return;
        }

        if (!(await routeUtils.rateLimit(userId, "createSetup", res)))
            return;

        obj = {
            ...obj,
            hash: hash,
            count: setup.count
        };

        if (req.body.editing) {
            await models.Setup.updateOne({ id: setup.id }, { $set: obj }).exec();
            res.send(req.body.id);
        }
        else {
            obj.id = shortid.generate();
            obj.creator = req.session.user._id;

            setup = new models.Setup(obj);
            await setup.save()
            await models.User.updateOne({ id: userId }, { $push: { setups: setup._id } }).exec();
            res.send(setup.id);
        }
    }
    catch (e) {
        logger.error(e);
        res.status(500);
        res.send("Unable to make setup.");
    }
});

function verifyRolesAndCount(setup) {
    const gameType = setup.gameType;
    const alignments = constants.alignments[gameType];
    const closed = setup.closed;
    const unique = setup.unique;
    var roles = setup.roles;
    var count = setup.count;
    var total = 0;

    if (!roles || !count)
        return ["Invalid role data"];

    if (closed) {
        /*
        * Closed role setup
        */

        if (!Array.isArray(roles))
            return ["Invalid role data"];

        roles = roles.slice(0, 1);

        //Check that all roles are valid roles
        for (let role in roles[0])
            if (!verifyRole(role, gameType))
                return ["Invalid role data"];

        var newCount = {};
        var rolesByAlignment = {};

        for (let alignment of alignments) {
            newCount[alignment] = Math.abs(Math.floor(Number(count[alignment]) || 0));
            total += newCount[alignment];
            rolesByAlignment[alignment] = [];

            if (isNaN(newCount[alignment]))
                return ["Invalid role data"];

            for (let role in roles[0]) {
                let roleName = role.split(":")[0];

                if (roleData[gameType][roleName].alignment == alignment)
                    rolesByAlignment[alignment].push(roleName);
            }
        }

        count = newCount;

        //Check the alignment counts
        var countCheck = countChecks[gameType](rolesByAlignment, count, total, closed, unique);

        if (countCheck != true)
            return [countCheck];

        //Sort the roles by alignment
        let tempRoleset = {};

        Object.keys(roles[0])
            .sort(sortRoles(gameType))
            .forEach(role => {
                tempRoleset[role] = roles[0][role];
                delete roles[0][role];
                roles[0][role] = tempRoleset[role];
            });
    }
    else {
        /*
        * Open role setup
        */

        count = null;

        if (!Array.isArray(roles))
            return ["Invalid role data"];

        if (roles.length == 0)
            return ["You must specify some roles"];

        //Check each roleset
        for (let i in roles) {
            let roleset = roles[i];

            //Check that all roles are valid roles
            for (let role in roleset)
                if (!verifyRole(role, gameType))
                    return ["Invalid role data"];

            //Count up role alignments
            let tempCount = {};
            let tempTotal = 0;

            for (let alignment of alignments)
                tempCount[alignment] = 0;

            for (let role in roleset) {
                let roleName = role.split(":")[0];
                roleset[role] = Math.abs(Math.floor(Number(roleset[role]) || 0));
                tempCount[roleData[gameType][roleName].alignment] += roleset[role];
                tempTotal += roleset[role];
            }

            //Verify that all player totals are the same
            if (i == 0)
                total = tempTotal;
            else
                if (tempTotal != total)
                    return ["All rolesets must have the same number of roles"];

            //Check the alignment counts
            let countCheck = countChecks[gameType](roleset, tempCount, total);

            if (countCheck != true)
                return [countCheck];

            //Sort the roles by alignment
            let tempRoleset = {};

            Object.keys(roleset)
                .sort(sortRoles(gameType))
                .forEach(role => {
                    tempRoleset[role] = roleset[role];
                    delete roleset[role];
                    roleset[role] = tempRoleset[role];
                });
        }
    }

    return [true, roles, count, total];
}

function verifyRole(role, gameType, alignment) {
    var roleName = role.split(":")[0];
    var modifier = role.split(":")[1];

    if (!roleData.hasOwnProperty(gameType))
        return false;

    if (!roleData[gameType].hasOwnProperty(roleName))
        return false;

    if (modifier && !constants.modifiers[gameType][modifier])
        return false;

    if (roleData[gameType][roleName].disabled)
        return false;

    if (alignment && roleData[gameType][roleName].alignment != alignment)
        return false;

    return true;
}

function sortRoles(gameType) {
    const alignments = constants.alignments[gameType];

    return (roleA, roleB) => {
        var roleAName = roleA.split(":")[0];
        var roleBName = roleB.split(":")[0];
        var alignA = roleData[gameType][roleAName].alignment;
        var alignB = roleData[gameType][roleBName].alignment;

        if (alignA != alignB)
            //Sort roles by alignment
            return alignments.indexOf(alignA) - alignments.indexOf(alignB);
        else
            //Sort roles of same alignment by alphabetical order
            return roleA < roleB ? -1 : 1;
    };
}

function hasOpenRole(roles, roleName) {
    roles = Object.keys(roles);
    roleName = utils.strParseAlphaNum(roleName);
    var regex = new RegExp(`${roleName}:`);

    for (let role of roles)
        if (role.match(regex))
            return true;

    return false;
}

const countChecks = {
    "Mafia": (roles, count, total, closed, unique) => {
        if (total < 3 || total > constants.maxPlayers)
            return "Must have between 3 and 50 players.";

        if (count["Mafia"] == 0 && count["Monsters"] == 0 && count["Independent"] == 0)
            return "Must have at least 1 Mafia, Monsters, or Independent role.";

        if (count["Mafia"] >= total - count["Mafia"] || count["Monsters"] >= total - count["Monsters"])
            return "Monsters or Mafia must not make up the majority.";


        if (!closed)
            return true;

        if (
            unique &&
            (count["Village"] > roles["Village"].length ||
                count["Mafia"] > roles["Mafia"].length ||
                count["Monsters"] > roles["Monsters"].length ||
                count["Independent"] > roles["Independent"].length)
        ) {
            return "Not enough roles chosen for unique selections with given alignment counts.";
        }

        if (
            !unique &&
            (count["Village"] > 0 && roles["Village"].length == 0 ||
                count["Mafia"] > 0 && roles["Mafia"].length == 0 ||
                count["Monsters"] > 0 && roles["Monsters"].length == 0 ||
                count["Independent"] > 0 && roles["Independent"].length == 0)
        ) {
            return "No roles chosen for some nonzero alignments.";
        }

        return true;
    },
    "Split Decision": (roles, count, total, closed, unique) => {

        if (total < 4)
            return "Must have between 4 and 50 players.";

        // If modifiers are added to Split Decision then this needs to be changed
        if (!closed) {
            if (!hasOpenRole(roles, "President"))
                return "Must have a President";

            if (!hasOpenRole(roles, "Bomber"))
                return "Must have a Bomber";
        }
        else {
            if (roles["Blue"].indexOf("President") == -1)
                return "Must have a President";

            if (roles["Red"].indexOf("Bomber") == -1)
                return "Must have a Bomber";
        }

        return true;
    },
    "Resistance": (roles, count, total, closed, unique) => {
        if (count["Resistance"] < 1 || count["Spies"] < 1)
            return "Must have at least one Resistance member and at leasty one Spies member.";

        return true;
    },
    "One Night": (roles, count, total, closed, unique) => {
        if (count["Village"] < 1 || count["Werewolves"] < 1)
            return "Must have at least one Village member and at leasty one Werewolf member.";

        return true;
    },
    "Ghost": (roles, count, total, closed, unique) => {
        if (count["Town"] < 1 || count["Ghost"] < 1)
            return "Must have at least one Town member and at leasty one Ghost member.";
        
        if (count["Ghost"] >= count["Town"])
            return "Ghosts must not make up the majority.";
        return true;
    },
};

const optionsChecks = {
    "Mafia": (setup) => {
        var lastWill = Boolean(setup.lastWill);
        var noReveal = Boolean(setup.noReveal);
        var votesInvisible = Boolean(setup.votesInvisible);

        return { lastWill, noReveal, votesInvisible };
    },
    "Split Decision": (setup) => {
        var swapAmt = Number(setup.swapAmt);
        var roundAmt = Number(setup.roundAmt) || 3;

        if (swapAmt < 1 || swapAmt > (setup.total / 2) - 1)
            return "Swap amount must be between 1 and one less than the number of players in a room.";

        if (roundAmt < 2 || roundAmt > 10)
            return "Games must have between 2 and 10 rounds.";

        return { swapAmt, roundAmt };
    },
    "Resistance": (setup) => {
        var firstTeamSize = Number(setup.firstTeamSize);
        var lastTeamSize = Number(setup.lastTeamSize);
        var numMissions = Number(setup.numMissions);
        var teamFailLimit = Number(setup.teamFailLimit);

        if (firstTeamSize < 2 || firstTeamSize > setup.total - 1)
            return "First team size must be between 2 and the number of players minus 1.";

        if (lastTeamSize < firstTeamSize)
            return "Last team size cannot be smaller than the first team size.";

        if (lastTeamSize > setup.total - 1)
            return "Last team size must be at most 1 less than the number of players.";

        if (numMissions < 2 || numMissions > 10)
            return "Number of missions must be between 2 and 10.";

        if (teamFailLimit < 1 || teamFailLimit > setup.total)
            return "Team fail limit must be between 1 and the number of players."

        return { firstTeamSize, lastTeamSize, numMissions, teamFailLimit };
    },
    "One Night": (setup) => {
        var votesInvisible = Boolean(setup.votesInvisible);
        var excessRoles = Number(setup.excessRoles);
        var newTotal = setup.total - excessRoles;

        if (excessRoles < 2 || excessRoles > 5)
            return "Excess roles must be between 2 and 5.";

        if (newTotal < 3)
            return "Total roles minus excess roles must be at least 3.";

        return { votesInvisible, excessRoles, total: newTotal };
    },
    "Ghost": (setup) => {
        let wordLength = Number(setup.wordLength);
        let townWord = setup.townWord;
        let foolWord = setup.foolWord;

        if (townWord.length !== wordLength)
            return "Town word length must be equal to the word size specified"

        if (foolWord && foolWord.length !== wordLength)
            return "Fool word length must be equal to the word size specified"

        return { wordLength, townWord, foolWord }
    }
};

module.exports = router;
