// only used by village core
FLAG_LIVE_JOIN = "liveJoin"

// vote for player
FLAG_VOTING = "voting"

// executed instantly, e.g. KillerBee
FLAG_INSTANT = "instant"

// does not cause veg when the time is up
FLAG_NO_VEG = "noVeg"

// multiple people share the same meeting
FLAG_GROUP = "group"
// meeting members can talk to each other
FLAG_SPEECH = "speech"
// speech is anonymous
FLAG_ANONYMOUS = "anonymous"

FLAG_MUST_ACT = "mustAct"

FLAG_HIDDEN = "hidden"
FLAG_ABSOLUTE = "absolute"

module.exports = {
    FLAG_LIVE_JOIN,
    FLAG_VOTING,
    FLAG_INSTANT,
    FLAG_NO_VEG,

    FLAG_GROUP,
    FLAG_SPEECH,
    FLAG_ANONYMOUS,
    
    FLAG_MUST_ACT,
    FLAG_HIDDEN,
    FLAG_ABSOLUTE,
}