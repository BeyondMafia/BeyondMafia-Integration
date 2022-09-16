const express = require("express");
const fbAdmin = require("firebase-admin");
const constants = require("../data/constants");
const routeUtils = require("../routes/utils");
const fbServiceAccount = require("../arcmafia-firebase-adminsdk-3rit5-12eaea47a7.json");
const logger = require("../modules/logging")(".");
const router = express.Router();

fbAdmin.initializeApp({
	credential: fbAdmin.credential.cert(fbServiceAccount)
});

router.post("/", async function (req, res) {
	try {
		var idToken = String(req.body.idToken);
		var userData = await fbAdmin.auth().verifyIdToken(idToken);
		await authSuccess(userData.uid, userData.email);
	}
	catch (e) {
		logger.error(e);
		res.status(500);
		res.send("Error authenticating.");
	}
});

async function authSuccess(uid, email) {
	try {
		/* *** Scenarios ***
			- Signed in
				- Linking new account (1)
				- Signing in to account (2)
				- Signing in to banned account (3)
			- Not signed in
				- Making new account
					- IP not suspicious (5)
					- IP suspicous (6)
				- Signing in to account (7)
				- Signing in to banned account (8)
				- Signing in to deleted banned account (9)
		*/

		var id = req.user && req.user.id;
		var ip = routeUtils.getIP(req);
		var user = await models.User.findOne({ email, deleted: false }).select("id");
		var bannedUser = await models.User.findOne({ email, banned: true }).select("id");

		if (!user && !bannedUser) { //Create new account (5) (6)
			id = shortid.generate();

			user = new models.User({
				id: id,
				name: nameGen().slice(0, constants.maxUserNameLength),
				email: email,
				fbUid: uid,
				joined: Date.now(),
				lastActive: Date.now(),
				ip: [ip]
			});
			await user.save();

			if (req.session.ref)
				await models.User.updateOne({ id: req.session.ref }, { $addToSet: { userReferrals: user._id } });

			var bannedSameIP = await models.User.find({ ip: ip, $or: [{ banned: true }, { flagged: true }] })
				.select("_id");
			var suspicious = bannedSameIP.length > 0;

			if (!suspicious) {
				var flaggedSameAccount = await models.User.find({ email, flagged: true })
					.select("_id");
				suspicious = flaggedSameAccount.length > 0;
			}

			if (!suspicious && process.env.IP_API_IGNORE != "true") {
				var res = await axios.get(`${process.env.IP_API_URL}/${process.env.IP_API_KEY}/${ip}?${process.env.IP_API_PARAMS}`);
				suspicious = res.data.fraud_score >= Number(process.env.IP_API_THRESH);
			}

			if (suspicious) { //(6)
				await models.User.updateOne({ id }, { $set: { flagged: true } }).exec();
				await routeUtils.banUser(
					id,
					0,
					["vote", "createThread", "postReply", "publicChat", "privateChat", "playGame", "editBio", "changeName"],
					"ipFlag"
				);
				await routeUtils.createNotification({
					content: `Your IP address has been flagged as suspicious. Please message an admin or moderator in the chat panel to gain full access to the site. A list of moderators can be found by clicking on this message.`,
					icon: "flag",
					link: "/community/moderation"
				}, [id]);
			}
		}
		else if (!id && bannedUser) { //(8) (9)
			await models.User.updateOne({ id: bannedUser.id }, {
				$addToSet: { ip: ip },
			});

			done(null, {});
			return;
		}
		else if (id && bannedUser) { //(3)
			await routeUtils.banUser(
				id,
				0,
				["signIn"],
				"bannedUser"
			);

			await models.User.updateOne({ id: id }, { $set: { banned: true } }).exec();
			await models.Session.deleteMany({ "session.passport.user.id": id }).exec();

			done(null, {});
			return;
		}
		else { //Link or refresh account (1) (2) (7)
			id = user.id;

			if (!(await routeUtils.verifyPermission(id, "signIn"))) {
				done(null, {});
				return;
			}

			await models.User.updateOne({ id: id }, { $addToSet: { ip: ip }, });
		}

		done(null, { _id: user._id, id: id, fbUid: uid });
		return id;
	}
	catch (e) {
		logger.error(e);
		done(null, {});
	}
}

module.exports = router;