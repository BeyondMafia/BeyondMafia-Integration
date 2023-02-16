const mafiaStatsObj = {
    totalGames: { type: Number, default: 0 },
    reads: {
        count: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    survival: {
        count: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    participation: {
        count: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    wins: {
        count: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
    abandons: {
        count: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
};

const mafiaStatsSet = {
    all: mafiaStatsObj,
    bySetup: {
        type: Map,
        of: mafiaStatsObj
    },
    byRole: {
        type: Map,
        of: mafiaStatsObj
    },
    byAlignment: {
        type: Map,
        of: mafiaStatsObj
    },
};

const allStats = {
    "Mafia": mafiaStatsSet,
};

module.exports = allStats; 