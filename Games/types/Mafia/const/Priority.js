// PRIORITY IS RESOLVED FROM LOWEST NUMBER (-101) TO HIGHEST NUMBER (100)

// WINCHECK PRIORITY
const PRIORITY_WIN_IF_LYNCHED = -10
const PRIORITY_WIN_BY_LYNCHING = -10
const PRIORITY_WIN_CHECK_DEFAULT = 0

// DAY PRIORITY
const PRIORITY_JAIL_MEETING = -10

// DAY PRIORITY
const PRIORITY_PARTY_MEETING = -2

// NIGHT PRIORITY
const PRIORITY_IDENTITY_STEALER_BLOCK = -200

const PRIORITY_REDIRECT_ACTION_CONTROL = -101
const PRIORITY_REDIRECT_ACTION_TARGET = -100
const PRIORITY_STEAL_ACTIONS = -99
const PRIORITY_SWAP_VISITORS_A = -98
const PRIORITY_SWAP_VISITORS_B_AND_SWAP = -97
const PRIORITY_BLOCK_VISITORS = -96
const PRIORITY_NIGHT_ROLE_BLOCKER = -95
const PRIORITY_NIGHT_NURSE = -95
const PRIORITY_CLEANSE_WEREWOLF_VISITORS = -94
const PRIORITY_KILL_LYCAN_VISITORS_ENQUEUE = -94
const PRIORITY_KILL_VISITORS_ENQUEUE = -94
const PRIORITY_NIGHT_SAVER = -93
const PRIORITY_NIGHT_TRAPPER = -92
const PRIORITY_NIGHT_REVIVER = -92

const PRIORITY_BITING_WOLF = -50

const PRIORITY_MODIFY_INVESTIGATIVE_RESULT_DEFAULT = -50
const PRIORITY_MAKE_INNOCENT = PRIORITY_MODIFY_INVESTIGATIVE_RESULT_DEFAULT
const PRIORITY_REVEAL_TARGET_ON_DEATH = PRIORITY_MODIFY_INVESTIGATIVE_RESULT_DEFAULT

const PRIORITY_ITEM_GIVER_DEFAULT = -50
const PRIORITY_EFFECT_GIVER_DEFAULT = -50

const PRIORITY_MESSAGE_GIVER_DEFAULT = -55
const PRIORITY_CONFIRM_SELF = PRIORITY_MESSAGE_GIVER_DEFAULT

const PRIORITY_INVESTIGATIVE_DEFAULT = -10
const PRIORITY_ALIGNMENT_LEARNER = PRIORITY_INVESTIGATIVE_DEFAULT
const PRIORITY_ROLE_LEARNER = PRIORITY_INVESTIGATIVE_DEFAULT

const PRIORITY_MIMIC_ROLE = -5
const PRIORITY_SWAP_ROLES = -4
const PRIORITY_CLEAN_DEATH = -3
const PRIORITY_IDENTITY_STEALER = -2

const PRIORITY_CULT_CONVERT = -2
const PRIORITY_MASON_CONVERT = -2
const PRIORITY_MAFIA_KILL = -1

const PRIORITY_KILL_DEFAULT = 0
const PRIORITY_KILL_LYCAN_VISITORS = PRIORITY_KILL_DEFAULT
const PRIORITY_KILL_VISITORS = PRIORITY_KILL_DEFAULT
const PRIORITY_NIGHT_KILLER = PRIORITY_KILL_DEFAULT
const PRIORITY_POISONER = PRIORITY_KILL_DEFAULT
const PRIORITY_JAIL_EXECUTE = PRIORITY_KILL_DEFAULT

const PRIORITY_MISMASON_MAFIA = 1

const PRIORITY_BECOME_DEAD_ROLE = 50

const PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT = 100
const PRIORITY_TRACK = PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT
const PRIORITY_WATCH = PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT
const PRIORITY_LEARN_VISITORS = PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT
const PRIORITY_CAROL = PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT
const PRIORITY_DREAMER = PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT

const ACT_ON_VISITORS_DEFAULT = 100
const PRIORITY_MAKE_VISITORS_INSANE = ACT_ON_VISITORS_DEFAULT
const PRIORITY_GIVE_VISITORS_ITEM = ACT_ON_VISITORS_DEFAULT

// DAY PRIORITY
const PRIORITY_VILLAGE_MEETING = 0
const PRIORITY_DAY_DEFAULT = 0

// SUNSET PRIORITY
const PRIORITY_LYNCH_REVENGE = 0

// LEADER PRIORITY
const PRIORITY_LEADER_DEFAULT = 1
const PRIORITY_LEADER_DISGUISER = PRIORITY_LEADER_DEFAULT
const PRIORITY_LEADER_NINJA = 2

module.exports = {

    // WINCHECK PRIORITY
    PRIORITY_WIN_CHECK_DEFAULT,
    PRIORITY_WIN_IF_LYNCHED,
    PRIORITY_WIN_BY_LYNCHING,

    // DAY PRIORITY
    PRIORITY_JAIL_MEETING,

    // DAY PRIORITY
    PRIORITY_PARTY_MEETING,

    // NIGHT PRIORITY
    PRIORITY_IDENTITY_STEALER_BLOCK,

    PRIORITY_REDIRECT_ACTION_CONTROL,
    PRIORITY_REDIRECT_ACTION_TARGET,
    PRIORITY_STEAL_ACTIONS,
    PRIORITY_SWAP_VISITORS_A,
    PRIORITY_SWAP_VISITORS_B_AND_SWAP,
    PRIORITY_NIGHT_ROLE_BLOCKER,
    PRIORITY_NIGHT_NURSE,
    PRIORITY_BLOCK_VISITORS,
    PRIORITY_CLEANSE_WEREWOLF_VISITORS,
    PRIORITY_KILL_LYCAN_VISITORS_ENQUEUE,
    PRIORITY_KILL_VISITORS_ENQUEUE,
    PRIORITY_NIGHT_SAVER,
    PRIORITY_NIGHT_TRAPPER,

    PRIORITY_BITING_WOLF,

    PRIORITY_MODIFY_INVESTIGATIVE_RESULT_DEFAULT,
    PRIORITY_MAKE_INNOCENT,
    PRIORITY_REVEAL_TARGET_ON_DEATH,

    PRIORITY_ITEM_GIVER_DEFAULT,
    PRIORITY_EFFECT_GIVER_DEFAULT,

    PRIORITY_CONFIRM_SELF,

    PRIORITY_INVESTIGATIVE_DEFAULT,
    PRIORITY_ALIGNMENT_LEARNER,
    PRIORITY_ROLE_LEARNER,

    PRIORITY_MIMIC_ROLE,
    PRIORITY_SWAP_ROLES,
    PRIORITY_CLEAN_DEATH,
    PRIORITY_IDENTITY_STEALER,

    PRIORITY_CULT_CONVERT,
    PRIORITY_MASON_CONVERT,
    PRIORITY_MAFIA_KILL,

    PRIORITY_KILL_DEFAULT,
    PRIORITY_KILL_LYCAN_VISITORS,
    PRIORITY_KILL_VISITORS,
    PRIORITY_NIGHT_KILLER,
    PRIORITY_POISONER,
    PRIORITY_JAIL_EXECUTE,

    PRIORITY_MISMASON_MAFIA,

    PRIORITY_BECOME_DEAD_ROLE,

    PRIORITY_INVESTIGATIVE_AFTER_RESOLVE_DEFAULT,
    PRIORITY_TRACK,
    PRIORITY_WATCH,
    PRIORITY_LEARN_VISITORS,
    PRIORITY_CAROL,
    PRIORITY_DREAMER,

    PRIORITY_MAKE_VISITORS_INSANE,
    PRIORITY_GIVE_VISITORS_ITEM,

    // DAY PRIORITY
    PRIORITY_VILLAGE_MEETING,
    PRIORITY_DAY_DEFAULT,

    // SUNSET PRIORITY
    PRIORITY_LYNCH_REVENGE,

    // LEADER PRIORITY
    PRIORITY_LEADER_DEFAULT,
    PRIORITY_LEADER_DISGUISER,
    PRIORITY_LEADER_NINJA,
};