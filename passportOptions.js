const passport = require("passport");
const axios = require("axios");
const OAuth2Strategy = require("passport-oauth").OAuth2Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SteamStrategy = require("passport-steam").Strategy;
const shortid = require("shortid");
const nameGen = require("./routes/utils").nameGen;
const models = require("./db/models");
const constants = require("./constants");
const routeUtils = require("./routes/utils");
const logger = require("./logging")(".");

function oauthSuccess(authType, uri, clientID, getIdentity, getId, getName, noRefresh) {
    return async function (req, accessToken, refreshToken, profile, done) {
        try {
            if (noRefresh) {
                done = profile;
                profile = refreshToken;
            }

            var identity;

            if (uri) {
                var res = await axios.get(uri, {
                    headers: {
                        "Client-ID": clientID,
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
                identity = res.data;
            }
            else
                identity = profile;

            identity = getIdentity(identity);

            /* *** Scenarios ***
                - Signed in
                    - Linking new account (1)
                    - Signing in to account (2)
                    - Signing in to banned account (3)
                    - Linking deleted banned account (4)
                - Not signed in
                    - Making new account
                        - IP not suspicious (5)
                        - IP suspicous (6)
                    - Signing in to account (7)
                    - Signing in to banned account (8)
                    - Signing in to deleted banned account (9)
            */

            var user;
            var id = req.user && req.user.id;
            var ip = routeUtils.getIP(req);
            var authId = getId(identity);
            var authName = getName(identity);
            var oauthUser = await models.User.findOne({ [`accounts.${authType}.id`]: authId, deleted: false }).select("id");
            var bannedUser = await models.User.findOne({ [`accounts.${authType}.id`]: authId, banned: true }).select("id");
            var giveColors = authType == "discord" && oldReferers[authId];

            if (id && !oauthUser)
                user = await models.User.findOne({ id: id, deleted: false })
                    .select("id itemsOwned banned");
            else
                user = oauthUser;

            if (!user && !bannedUser) { //Create new account (5) (6)
                id = shortid.generate();

                user = new models.User({
                    id: id,
                    name: nameGen().slice(0, constants.maxUserNameLength),
                    accounts: {
                        [authType]: {
                            id: authId,
                            name: authName
                        }
                    },
                    itemsOwned: {
                        textColors: giveColors ? 1 : 0
                    },
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
                    var flaggedSameAccount = await models.User.find({ [`accounts.${authType}.id`]: authId, flagged: true })
                        .select("_id");
                    suspicious = flaggedSameAccount.length > 0;
                }

                if (!suspicious && process.env.IP_API_IGNORE != "true") {
                    var res = await axios.get(`${process.env.IP_API_URL}/${process.env.IP_API_KEY}/${ip}?${process.env.IP_API_PARAMS}`);
                    suspicious = res.data.fraud_score >= 65;
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
                done(null, {});
                return;
            }
            else if (id && bannedUser) { //(3) (4)
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

                await models.User.updateOne({ id: id },
                    {
                        $addToSet: { ip: ip },
                        $set: {
                            [`accounts.${authType}`]: {
                                id: getId(identity),
                                name: getName(identity)
                            },
                            "itemsOwned.textColors": giveColors || user.itemsOwned.textColors > 0 ? 1 : 0
                        }
                    });
            }

            done(null, { _id: user._id, id: id });
        }
        catch (e) {
            logger.error(e);
            done(null, {});
        }
    }
}

passport.use("discord", new OAuth2Strategy({
    scope: "identify",
    authorizationURL: "https://discordapp.com/api/oauth2/authorize",
    tokenURL: "https://discordapp.com/api/oauth2/token",
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_URL}/auth/discord/redirect`,
    passReqToCallback: true
}, oauthSuccess(
    "discord",
    "https://discordapp.com/api/users/@me",
    process.env.DISCORD_CLIENT_ID,
    identity => identity,
    identity => identity.id,
    identity => identity.username + "#" + identity.discriminator,
)));

passport.use("twitch", new OAuth2Strategy({
    authorizationURL: "https://id.twitch.tv/oauth2/authorize",
    tokenURL: "https://id.twitch.tv/oauth2/token",
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_URL}/auth/twitch/redirect`,
    passReqToCallback: true
}, oauthSuccess(
    "twitch",
    "https://api.twitch.tv/helix/users",
    process.env.TWITCH_CLIENT_ID,
    identity => identity.data[0],
    identity => identity.id,
    identity => identity.display_name
)));

passport.use("google", new GoogleStrategy({
    scope: "profile",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.OAUTH_URL}/auth/google/redirect`,
    passReqToCallback: true
}, oauthSuccess(
    "google",
    null,
    process.env.GOOGLE_CLIENT_ID,
    identity => identity,
    identity => identity.id,
    // identity => identity.displayName
    () => ""
)));

passport.use("steam", new SteamStrategy({
    returnURL: `${process.env.OAUTH_URL}/auth/steam/redirect`,
    realm: process.env.OAUTH_URL,
    apiKey: process.env.STEAM_API_KEY,
    passReqToCallback: true
}, oauthSuccess(
    "steam",
    null,
    null,
    identity => identity,
    identity => identity.id,
    identity => identity.displayName,
    true
)));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const oldReferers = {
    "153299118461026304": true,
    "126072191644205056": true,
    "270726069873672192": true,
    "227494337452179456": true,
    "178150059270078466": true,
    "399766311028391936": true,
    "192119285856993281": true,
    "231492437770502144": true,
    "341647117980401664": true,
    "305862423468834827": true,
    "216685350586810371": true,
    "263989257834725376": true,
    "427311407785181189": true,
    "190579111419314176": true,
    "322624343328948224": true,
    "255944427665752064": true,
    "378658060148932609": true,
    "458221859272654852": true,
    "286090749127294976": true,
    "205039076561256448": true
};

module.exports = passport;
