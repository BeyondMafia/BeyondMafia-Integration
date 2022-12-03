export const GameTypes = ["Mafia", "Split Decision", "Resistance", "One Night"];
export const Lobbies = ["Main", "Sandbox", "Competitive", "Games"];

export const Alignments = {
	"Mafia": ["Village", "Mafia", "Monsters", "Independent"],
	"Split Decision": ["Blue", "Red", "Independent"],
	"Resistance": ["Resistance", "Spies"],
	"One Night": ["Village", "Werewolves", "Independent"],
};

export const GameStates = {
	"Mafia": ["Day", "Night"],
	"Split Decision": ["Initial Round", "Hostage Swap"],
	"Resistance": ["Team Selection", "Team Approval", "Mission"],
	"One Night": ["Day", "Night"],
};

export const RatingThresholds = {
	"reads": {
		"S": 0.95,
		"A": 0.9,
		"B": 0.8,
		"C": 0.7,
		"D": 0.6,
		"E": 0.5,
	},
	"survival": {
		"S": 0.95,
		"A": 0.9,
		"B": 0.8,
		"C": 0.7,
		"D": 0.6,
		"E": 0.5,
	},
	"participation": {
		"S": 0.95,
		"A": 0.9,
		"B": 0.8,
		"C": 0.7,
		"D": 0.6,
		"E": 0.5,
	},
};

export const RequiredTotalForStats = 1;

export const MaxGameMessageLength = 240;
export const MaxWillLength = 100;

export const MaxGroupNameLength = 20;
export const MaxCategoryNameLength = 20;
export const MaxBoardNameLength = 20;
export const MaxBoardDescLength = 60;
export const MaxThreadTitleLength = 50;
export const MaxThreadContentLength = 5000;
export const MaxReplyLength = 1000;

export const MaxChatMessageLength = 240;

export const AlertFadeTimeout = 3000;
export const AlertFadeDuration = 500;

