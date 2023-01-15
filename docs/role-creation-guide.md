# Role Creation Guide

Firstly, thank you so much for taking the time to contribute to BeyondMafia. This guide aims to bring you from zero to hero. You would first need to get your site running by following the project's README.

## Setup

#### Choose a role to implement.

Refer to [this issue](https://github.com/r3ndd/BeyondMafia-Integration/issues/16) for a full list of roles that require implementation. There are also links to mechanic description and system messages

Drop a comment stating which role you want to work on.

Locally, checkout a branch for the role you want to make.

`git checkout -b add-journalist`

## Create Role

#### 1. Add role description in `data/roles.js`. 

For now, just append the role at the bottom of the list.

#### 2. Add role class in `Games/core/types/Mafia/roles/<Alignment>`. 

You can refer to other role classes like [Arms Dealer](/Games/types/Mafia/roles/Village/ArmsDealer.js) for the template. Generally, it would be like this:

```
const Role = require("../../Role");

module.exports = class ArmsDealer extends Role {

	constructor(player, data) {
		super("Arms Dealer", player, data);
		this.alignment = "Village";
		this.cards = ["VillageCore", "WinWithVillage", "GunGiver"];
	}

}
```

#### 3. Add the role card(s) in `Games/core/types/Mafia/roles/cards`.

Some example cards that you can refer to

- Investigative: AlignmentLearner (Cop), RoleLearner (Seer), TrackPlayer (Tracker)
- GiveItems: ArmorGiver (Blacksmith)
- Roles can also save state in `this.actor.role.data`, e.g. in RevealTargetOnDeath (Oracle) and Carol

#### 4. Depending on the role, you might have to add items, effects and meetings in `Games/core/types/Mafia/<items/effects/meetings>`

When you put a `meeting` under and `item` like Orange and Handcuffs, then the item holder will have the meeting.

When you put a `meeting` under a card, then roles with that card/ modifier will have the meeting.

#### 5. Add the role priority in `Games/core/types/Mafia/const/Priority.js`

The priority queue is resolved from smaller numbers to larger numbers. Actions that are resolved first are put higher in the list.

## Testing Role

#### 1. Add role test in `test/Games/Game.test.js`. This is currently optional, but makes it easy to check if future roles break existing mechanics.

#### 2. Run test games with your new role. [Set up dev mode](/docs/bot-games.md) on your user to allow yourself to play games with bots.

## Integrating role into BeyondMafia

#### 1. Commit your changes to your remote branch.

```
git add *
git commit -m "add journalist implementation"
git push origin add-journalist
```

#### 2. Make a Pull Request from your branch (e.g. `add-journalist`) to the rend's `master` branch.

(Note: in future, you will make the PR to the `dev` branch instead. The site is undergoing rapid development so the dev branch is not available yet.)

#### 3. (skip for now) Once your changes have been merged into the `dev` branch, test the role on `test.beyondmafia.com`.

#### 4. Once your changes have been merged into the `master` branch, test your role on `beyondmafia.com` and keep a look out for bug reports for it.

#### 5. Send a DM to `LemonSun` or any moderator to open role icon requests for the role. You can do this step earlier if you wish.

## Pull Request Checklist

- [] Add role description in `data/roles.js`
- [] Add role class in `Games/core/types/Mafia/roles/<Alignment>`
- [] Add role card (ability) in `Games/core/types/Mafia/roles/cards`
- [] (optional) Add role items, effects, meetings `Games/core/types/Mafia/<items/effects/meetings>`
- [] Add the card priority in `Games/core/types/Mafia/const/Priority.js`
- [] (optional) Add role test in test/Games/Game.test.js
- [] Tested the role mechanics

## References

- [Capybara PR](https://github.com/r3ndd/BeyondMafia-Integration/pull/2)
- [Alien PR](https://github.com/r3ndd/BeyondMafia-Integration/pull/11)
- [Associate PR](https://github.com/r3ndd/BeyondMafia-Integration/pull/29)