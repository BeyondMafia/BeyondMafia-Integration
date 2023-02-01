// only used by village core
const FLAG_LIVE_JOIN = "liveJoin"

// vote for player
const FLAG_VOTING = "voting"

// executed instantly, e.g. KillerBee
const FLAG_INSTANT = "instant"

// does not cause veg when the time is up
const FLAG_NO_VEG = "noVeg"

// only one exclusive meeting can be attended each night
const FLAG_EXCLUSIVE = "exclusive"

// multiple people share the same meeting
const FLAG_GROUP = "group"
// meeting members can talk to each other
const FLAG_SPEECH = "speech"
// speech is anonymous
const FLAG_ANONYMOUS = "anonymous"

const FLAG_MUST_ACT = "mustAct"

module.exports = {
    FLAG_LIVE_JOIN,
    FLAG_VOTING,
    FLAG_INSTANT,
    FLAG_NO_VEG,
    FLAG_EXCLUSIVE,

    FLAG_GROUP,
    FLAG_SPEECH,
    FLAG_ANONYMOUS,
    
    FLAG_MUST_ACT,
}