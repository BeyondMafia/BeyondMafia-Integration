const roleData = {
    "Mafia": {
        //Village
        "Villager": {
            alignment: "Village",
            description: [
                "Wins when no mafia or malevolent independents remain."
            ],
        },
        "Doctor": {
            alignment: "Village",
            description: [
                "Saves one player from dying each night.",
                "Cannot save self."
            ],
        },
        "Arms Dealer": {
            alignment: "Village",
            description: [
                "Gives out a gun each night."
            ],
        },
        "Cop": {
            alignment: "Village",
            description: [
                "Investigates one player each night and learns their alignment.",
                "Multiple cops share a night meeting."
            ],
        },
        "Insane Cop": {
            alignment: "Village",
            description: [
                "Investigates one player each night and learns their alignment (alignment will be reversed).",
                "Appears as normal cop upon death.",
                "Multiple insane cops share a night meeting."
            ],
        },
        "Naive Cop": {
            alignment: "Village",
            description: [
                "Investigates one player each night and learns their alignment (alignments will always appear innocent).",
                "Appears as normal cop upon death.",
                "Multiple naive cops share a night meeting."
            ],
        },
        "Paranoid Cop": {
            alignment: "Village",
            description: [
                "Investigates one player each night and learns their alignment (alignments will always appear guilty).",
                "Appears as normal cop upon death.",
                "Multiple paranoid cops share a night meeting."
            ],
        },
        "Oracle": {
            alignment: "Village",
            description: [
                "Chooses one player each night whose role will be revealed upon death."
            ],
        },
        "Vigilante": {
            alignment: "Village",
            description: [
                "Kills one player each night."
            ],
        },
        "Detective": {
            alignment: "Village",
            description: [
                "Investigates one player each night and learns their role.",
            ],
        },
        "Escort": {
            alignment: "Village",
            description: [
                "Chooses one player each night and blocks them from performing any night actions.",
            ],
        },
        "Blacksmith": {
            alignment: "Village",
            description: [
                "Gives out armor to one player each night.",
                "Armor blocks a single attack."
            ],
        },
        "Hunter": {
            alignment: "Village",
            description: [
                "Chooses a player to kill when executed by town during the day."
            ],
        },
        "Watcher": {
            alignment: "Village",
            description: [
                "Watches a player each night and learns who visited them."
            ],
        },
        "Tracker": {
            alignment: "Village",
            description: [
                "Tracks a player each night and learns who they visited."
            ],
        },
        "Governor": {
            alignment: "Village",
            description: [
                "Overrides village execution once per game.",
                "Cannot cancel a village execution." ,
                "Choosing no one preserves the governor's override ability."
            ],
        },
        "Monkey": {
            alignment: "Village",
            description: [
                "Steal the actions of a player to do for themselves each night.",
                "The action stolen can be blocked.",
                "Steal cannot be blocked." ,
                
            ],
        },
        "Agent": {
            alignment: "Village",
            description: [
                "Attempts to guess the identity of the Spy each night.",
                "Kills the Spy if guess is correct."
            ],
        },
        "Sheriff": {
            alignment: "Village",
            description: [
                "Starts with a gun.",
                "This gun always reveals the sheriff when shot."
            ],
        },
        "Deputy": {
            alignment: "Village",
            description: [
                "Starts with a gun.",
                "This gun never reveals the deputy when shot."
            ],
        },
        "Bulletproof": {
            alignment: "Village",
            description: [
                "Starts with armor.",
                "Armor blocks a single attack."
            ],
        },
        "Bomb": {
            alignment: "Village",
            description: [
                "Starts with a bomb.",
                "Bomb goes off when player is killed, targeting the attacker.",
                "Bomb does not go off when executed by village.",
            ],
        },
        "Village Idiot": {
            alignment: "Village",
            description: [
                "Sees all speech as coming from random people.",
                "Appears as Villager to self."
            ],
        },
        "Medic": {
            alignment: "Village",
            description: [
                "Save one person from dying each night.",
                "Can save self."
            ],
        },
        "Granny": {
            alignment: "Village",
            description: [
                "Kills all players who visit her during the night.",
                "Cannot be killed or converted at night.",
                "Can only be killed by village execution."
            ],
        },
        "Templar": {
            alignment: "Village",
            description: [
                "Shares a night meeting with other Templars."
            ],
        },
        "Miller": {
            alignment: "Village",
            description: [
                "Appears as Villager to self.",
                "Appears as Mafioso to investigative roles.",
                "Appears as Mafioso upon being executed.",
                "Appears as Miller upon being killed.",
            ],
        },
        "Mayor": {
            alignment: "Village",
            description: [
                "Identity is publicly revealed to all players at the start of the game.",
            ],
        },
        "Priest": {
            alignment: "Village",
            description: [
                "Cleanses werewolves when visited by them.",
                "Kills Lycan when visited by them."
            ],
        },
        "Mason": {
            alignment: "Village",
            description: [
                "Converts one player into a Mason each night.",
                "Shares a night meeting with other Masons.",
                "All Masons die if they attempt to convert a member of the Mafia.",
            ],
        },
        "Jailer": {
            alignment: "Village",
            description: [
                "Chooses someone to jail each day meeting.",
                "Meets with the prisoner at night and the prisoner cannot perform actions or attend other meetings.",
                "Decides whether or not the prisoner should be executed.",
            ],
        },
        "Psychic": {
            alignment: "Village",
            description: [
                "Can anonymously contact any non-Village role during the day.",
            ],
        },
        "Funsmith": {
            alignment: "Village",
            description: [
                "Gives out a gun each night.",
                "Gives out a gun to all visitors at night.",
            ],
        },
        "Town Crier": {
            alignment: "Village",
            description: [
                "Can anonymously broadcast messages during the day.",
            ],
        },
        "Capybara": {
            alignment: "Village",
            description: [
                "Chooses a player to invite to a hot springs relaxation by giving them a Yuzu OrangeZ each night.",
                "When holding a Yuzu OrangeZ, player can choose during the day to anonymously meet with the Capybara and other Yuzu OrangeZ holders the following night.",
                "Multiple Capybaras share a night meeting.",
            ],
        },
        "Neighbor": {
            alignment: "Village",
            description: [
                "Visits a player each night to reveal their role identity.",
            ],
        },
        "Nurse": {
            alignment: "Village",
            description: [
                "Saves one person each night from dying and blocks them from performing night actions.",
                "Cannot save self."
            ],
        },
        "Commuter": {
            alignment: "Village",
            description: [
                "Blocks all visitors during the night from performing any actions.",
            ],
        },
        "Caroler": {
            alignment: "Village",
            description: [
                "Sings a carol to a player about 3 people, at least one of whom is Mafia aligned.",
                "The carol is not heard if the player chosen visits at night.",
                "Cannot choose same the player consecutively.",
            ],
        },
        "Dreamer": {
            alignment: "Village",
            description: [
                "Dreams about 3 people, at least one of whom is Mafia aligned, or about 1 person who is Village aligned.",
                "Does not dream if visited at night.",
            ],
        },
        "Chef": {
            alignment: "Village",
            description: [
                "Chooses two players during the day to attend a banquet the following evening.",
                "Players chosen to attend the banquet meet anonymously with their roles revealed to one another.",
            ],
        },
        "Journalist": {
            alignment: "Village",
            description: [
                "Chooses a player each night and views any system messages they recieve the following day."
            ],
        },
        "Cutler": {
            alignment: "Village",
            description: [
                "Gives out a knife each night.",
                "Knives can be used to attack a player during the day and will result in that players death the following day."
            ],
        },
        "Snowman": {
            alignment: "Village",
            description: [
                "Gives out a snowball each night.",
                "Snowballs can be thrown at a player during the day and will block their actions the following night.",
                "Snowballs thrown at the Snowman will have no effect."
            ],
        },
        "Snoop": {
            alignment: "Village",
            description: [
                "Visits a player each night and learns what items they are carrying.",
            ],
        },
        "Justice": {
            alignment: "Village",
            description: [
                "Investigates two people at night and learns if they share an alignment."
            ],
        },
        "Invisible Man": {
            alignment: "Village",
            description: [
                "Choose one player during the day to follow at night.",
                "Views all messages from that player's meetings that night.",
                ],
        },
        "Cyclist": {
            alignment: "Village",
            description: [
                "Chooses two players, A and B, each night.",
                "Players who visit A will be redirected to B.",
                "Players who visit B will be redirected to A.",
                "Redirection does not count as a visit and cannot be role blocked."
            ],
        },
        "Sapling": {
            alignment: "Village",
            description: [
                "Choose whether or not to grow into a tree at night.",
                "Tree is immune to most ways of dying.",
                "Tree cannot vote."
                ],
        },
        "Tree": {
            alignment: "Village",
            disabled: true,
            description: [
                "Tree is immune to most ways of dying.",
                "Tree cannot vote."
                ],
        },
        "Baker": {
            alignment: "Village",
            description: [
                "When baker is present in the game, all players start with two breads.",
                "Gives out up to two breads each night.",
                "If all bakers die, a famine will start, and each player will comsume one bread per day cycle and night cycle.",
                "Players who run out of bread after famine has begun will die."
            ],
        },
        "Virgin": {
            alignment: "Village",
            description: [
                "If executed by the village, no one will die the following night.",
            ],
        },
        "Mimic": {
            alignment: "Village",
            description: [
                "Chooses a player at night and attempt to mimic their role.",
                "If player is town, mimic steals their role and that player becomes a villager.",
                "If player is mafia, mimic becomes villager.",
                "If player is independent or monster, mimic becomes amnesiac."
            ],
        },
        "Judge": {
            alignment: "Village",
            description: [
                "Vote weight is worth 2 players votes in day meeting."
            ],
        },
        "Party Host": {
            alignment: "Village",
            description: [
                "Chooses to host a party during day meeting for everyone to attend once per game on the following night.",
                "Everyone will share a night meeting."
            ],
        },
        "Loudmouth": {
            alignment: "Village",
            description: [
                "If visited, cries out the idenity of players who visited them during the night.",
                "Appears as villager to self."
            ],
        },      
        "Ghost": {
            alignment: "Village",
            description: [
                "Appears as villager to self, until dead.",
                "Once dead, chooses to block one player each night."
            ],
            graveyardParticipation: "self",
        },
        "Lightkeeper": {
            alignment: "Village",
            description: [
                "Following their death, causes an eclipse during the day",
                "During an eclipse all speech and votes are anonymous."
            ],
        },
        "Resurrectionist": {
            alignment: "Village",
            description: [
                "Visits a dead player during the night once per game.",
                "That player will be resurrected the following day.",
                "If players identity was revealed upon death, they will remain revealed when ressurected."
            ],
            graveyardParticipation: "all",
        },
        "Trickster": {
            alignment: "Village",
            description: [
                "Gives out an item each night to a random player.",
                "The item can be a Gun, Knife, Armor, Snowball, or Crystal.",
                "The item has a 50% chance to be Cursed.",
                "Cursed items will misfire or be otherwise ineffective.",
                "Appears as Villager to self."
            ],
        },
        "Medium": {
            alignment: "Village",
            description: [
                "Holds a seance with a dead player once per night.",
                "Identity is not revealed to the dead player."
            ],
            graveyardParticipation: "all",
        },
        "Robin Hood": {
            alignment: "Village",
            description: [
                "Chooses one player to steal from each night and another player to recieve their items.",
                "If the person chosen to recieve is mafia, the steal will not go through.",
            ],
        },
        "Enchantress": {
            alignment: "Village",
            description: [
                "Gives out a crystal to a player during the night, once per game.",
                "Crystals reveal the chosen player's role identity upon the holder's death."
            ],
        },
        "Forager": {
            alignment: "Village",
            description: [
                "Forages for an item if not visited by anyone during the night.",
                "Foraged item can be a Gun, Knife, Armor, Crystal or Snowball.",
            ],
        },
        "Mortician": {
            alignment: "Village",
            description: [
                "Chooses to visit a dead player at night and learns their role idenity."
            ],
        },
        "Santa": {
            alignment: "Village",
            description: [
                "Visits a player each night to learn their role alignment.",
                "If not visited during the night, will learn whether that player is naughty or nice.",
                "Gives out a Gun, Knife, Armor, Crystal, or Snowball, each night."
            ],
        },
        "Tinkerer": {
            alignment: "Village",
            description: [
                "Crafts a gun if not visited during the night.",
                "If killed, the killer will find a gun that always reveals.",
            ],
        },
        "King": {
            alignment: "Village",
            description: [
                "Vote overrides others in village meeting.",
                "Appears as Villager to self."
            ],
        },
        "Sleepwalker": {
            alignment: "Village",
            description: [
                "Visits a random person each night.",
                "Appears as Villager to self.",
            ],
        },
        "Messenger": {
            alignment: "Village",
            description: [
                "Sends an anonymous message to a player of choice during the night.",
            ],
        },
        "Visitor": {
            alignment: "Village",
            description: [
                "Pays a visit to another player at night, though annoying, with no effect."
            ],
        },
        "Waitress": {
            alignment: "Village",
            description: [
                "Visits a player and blocks them from performing actions at night.",
                "Steals any items they are holding.",
            ],
        },

        //Mafia
        "Mafioso": {
            alignment: "Mafia",
            description: [
                "Wins when the mafia outnumbers all other players.",
            ],
        },
        "Chemist": {
            alignment: "Mafia",
            description: [
                "Concocts a deadly poison and administers it to one person each night.",
                "The poisoned target will die at the end of the following night unless saved.",
            ],
        },
        "Stalker": {
            alignment: "Mafia",
            description: [
                "Stalks one person each night and learns their role.",
            ],
        },
        "Hooker": {
            alignment: "Mafia",
            description: [
                "Each night, chooses one person and blocks them from performing any actions.",
            ],
        },
        "Godfather": {
            alignment: "Mafia",
            description: [
                "Leads the mafia kill each night.",
                "Appears as Villager/innocent to investigative roles.",
            ],
        },
        "Driver": {
            alignment: "Mafia",
            description: [
                "Each night, chooses two targets, A and B.",
                "Players who visit A will be redirected to B, and players who visit B will be redirected to A.",
                "Does not visit.",
                "Redirection cannot be role blocked."
            ],
        },
        "Spy": {
            alignment: "Mafia",
            description: [
                "Attempts to guess the identity of the Agent each night.",
                "Kills the Agent if guess is correct."
            ],
        },
        "Ninja": {
             alignment: "Mafia",
             description: [
                 "Does not get detected by watchers and trackers.",
                 "Can kill bomb without getting killed."
         
            ],
        },
        "Lawyer": {
            alignment: "Mafia",
            description: [
                "Chooses a fellow mafia member each night and makes them appear as a Villager/innocent to investigative roles."
            ],
        },
        "Disguiser": {
            alignment: "Mafia",
            description: [
                "Can steal the identity of the person killed by the Mafia each night.",
                "Cannot be targeted while disguising.",
            ],
        },
        "Sniper": {
            alignment: "Mafia",
            description: [
                "Starts with a gun.",
                "Gun does not reveal the sniper when shot.",
                "Does not attend Mafia meetings.",
            ],
        },
        "Janitor": {
            alignment: "Mafia",
            description: [
                "Can choose a person to clean once.",
                "If that person dies their role will not be revealed.",
                "Learns the cleaned player's role.",
            ],
        },
        "Telepath": {
            alignment: "Mafia",
            description: [
                "Can anonymously contact any role.",
            ],
        },
        "Associate": {
            alignment: "Mafia",
            description: [
                "Hands out a gun each night.",
                "The gun will only kill if the target is not aligned with Mafia.",
            ],
        },
        "Gramps": {
            alignment: "Mafia",
            description: [
                "Learns role of any player who visits him.",
                "Cannot be killed normally."
            ],
        },
        "Lookout": {
            alignment: "Mafia",
            description: [
                "Watches someone each night and learns who visits them."
            ],
        },
        "Scout": {
            alignment: "Mafia",
            description: [
                "Tracks someone each night and learns who they visit."
            ],
        },
        "Arsonist": {
            alignment: "Mafia",
            description: [
                "Douses one player with Gasoline each night.",
                "Can light one match during the day to burn doused players.",
            ],
        },
        "Killer Bee": {
            alignment: "Mafia",
            description: [
                "Once per game, can fatally sting another player during the day, killing them both."
            ],
        },
        "Diabolist": {
            alignment: "Mafia",
            description: [
                "Can choose a victim and a target each night.",
                "If the victim votes for the target, the victim will die."
            ]
        },
        "Tailor": {
            alignment: "Mafia",
            description: [
                "Gives out suits that make the wearer appear to be a different role."
            ],
        },
        "Actress": {
            alignment: "Mafia",
            description: [
                "Learns a targets role and appears to be that role."
            ],
        },
        "Prosecutor": {
            alignment: "Mafia",
            description: [
                "Votes weight is 2."
            ],
        },
        "Fabricator": {
            alignment: "Mafia",
            description: [
                "Once per night can give out an ill-fated version of many items."
            ],
        },
        "Heartbreaker": {
            alignment: "Mafia",
            description: [
                "Once per game can fall in love with another player.",
                "If Heartbreaker dies, both players will die.",
            ],
        },
        "Yakuza": {
            alignment: "Mafia",
            description: [
                "Can choose to sacrifice themself to convert one player to Mafioso.",
            ],
        },
        "Necromancer": {
            alignment: "Mafia",
            description: [
                "Once per game, visits one dead person during the night.",
                "That person will be resurrected.",
            ],
            graveyardParticipation: "all",
        },
        "Mummy": {
            alignment: "Mafia",
            description: [
                "Everyone who visits the mummy while the mummy is dead dies.",
            ],
        },
        "Poltergeist": {
            alignment: "Mafia",
            description: [
                "Once dead, may visit one person a night and roleblock them.",
           ],
           graveyardParticipation: "self",
        },
        "Informant": {
            alignment: "Mafia",
            description: [
                "Can pick a person every night.",
                "Any system messages that person may have got are given to the informant as well"
            ],
         },
        "Jinx": {
            alignment: "Mafia",
            description: [
                "Each night, curses a player with a word.",
                "If the person speaks the word the next day, they will die."
            ],
        },
        "Clown": {
            alignment: "Mafia",
            description: [
                "Appears as Fool to self.",
                "Will kill their visit target.",
            ],
        },
        "Graverobber": {
            alignment: "Mafia",
            description: [
                "Can visit a dead player every night.",
                "Learns the role of that player and takes all items they're holding.",
            ],
        },
        "Medusa": {
            alignment: "Mafia",
            description: [
                "Once per game, during the day, can turn all visitors last night to stone.",
                ],
        },
        "Illusionist": {
            alignment: "Mafia",
            description: [
                "Starts with a gun.",
                "Each night, chooses one person to frame as the shooter of any guns shot by the Illusionist."
            ],
        },
        "Cat Lady": {
            alignment: "Mafia",
            description: [
                "Every day, chooses a person to send a cat to.",
                "At night, the target can choose to let the cat in or chase it out.",
                "If the cat is let in, the target is roleblocked.",
                "If chased out, the Cat Lady will learn the role of the target."
            ],
        },
        "Slasher": {
            alignment: "Mafia",
            description: [
                "If not visited during the night, will receive a knife.",
                "Slasher knives do not reveal.",
            ],
        },
        "Courier": {
            alignment: "Mafia",
            description: [
                "Anonymously sends message at night to another player of their choice.",
            ],
        },
        "Trespasser": {
            alignment: "Mafia",
            description: [
                "Trespasses on another player's property at night, though annoying, with no effect."
            ],
        },
        "Housekeeper": {
            alignment: "Mafia",
            description: [
                "Once per game, visit a player.",
                "Steals this person's items and clears their will."
            ]
        },
        "Thief": {
            alignment: "Mafia",
            description: [
                "Chooses one person each night.",
                "Steals an item from that player.",
                "Does not attend Mafia meetings.",
            ],
        },
        "Crank": {
            alignment: "Mafia",
            description: [
                "Chooses a dead player per night and holds a seance with that player.",
                "Crank's identity is not revealed to the dead player.",  
            ],
            graveyardParticipation: "all",
        },

        //Monsters
        "Lycan": {
            alignment: "Monsters",
            description: [
                "Invincible during full moons, except for visiting the Priest.",
                "Each night, bites a non-monster player and turns them into a werewolf.",
                "Werewolves retain their original roles, but they unknowingly kill a random non-monster player on full moons."
            ],
        },
        "Witch": {
            alignment: "Monsters",
            description: [
                "Can choose a player to control.",
                "Chooses who that player will perform their actions on.",
                "Redirection cannot be role blocked.",
                "Causes an eclipse during the day following her death.",
                "All votes and speech are anonymous during an eclipse."
            ],
        },
        "Cultist": {
            alignment: "Monsters",
            description: [
                "Meets with other Cultists and Monsters during the night.",
                "The Cultists convert one player into a Cultist each night.",
                "All Cultists die if a leader (original Cultist) dies.",
            ],
        },
        "Cthulhu": {
            alignment: "Monsters",
            description: [
                "All who visit the Cthulhu go insane.",
                "Insane players speak gibberish."
            ],
        },
        "The Thing": {
            alignment: "Monsters",
            description: [
                "Can hunt prey at night by choosing a target and guessing their role.",
                "If guessed correctly, becomes immortal for the next day, if incorrect will be revealed to all."
            ],
        },

        //Independent
        "Fool": {
            alignment: "Independent",
            description: [
                "Fools around at night, visiting another player with no effect.",
                "Wins if executed by the town.",
                "No one else wins if the Fool wins.",
            ],
        },
        "Executioner": {
            alignment: "Independent",
            description: [
                "Is randomly assigned a Village/Independent player as a target.",
                "Wins if their target is executed in Village meeting while alive.",
            ],
        },
        "Serial Killer": {
            alignment: "Independent",
            description: [
                "Must kill a player each night.",
                "Wins if among last two alive."
            ],
        },
        "Amnesiac": {
            alignment: "Independent",
            description: [
                "Once per game can become the role of a dead player."
            ],
        },
        "Survivor": {
            alignment: "Independent",
            description: [
                "Wins if survives until the end of the game."
            ],
        },
        "Alien": {
            alignment: "Independent",
            description: [
                "Can choose one player to probe each night.",
                "Wins if all players left alive have been probed."
            ],
        },
        "Old Maid": {
            alignment: "Independent",
            description: [
                "Can choose one player to swap roles with each night.",
                "Cannot win the game.",
            ],
        },
        "Traitor": {
            alignment: "Independent",
            description: [
                "Wins when mafia wins.",
                "Does not count towards mafia win count.",
            ],
        },
        "Mastermind": {
            alignment: "Independent",
            description: [
                "Mafia meeting is anonymous",
                "Wins instead of mafia and counts toward their total",
                ],
        },
        "Lover": {
            alignment: "Independent",
            description: [
                "Once per game can fall in love with another player.",
                "Both players die if either dies.",
                "Wins if both players survive until the end of the game.",
            ],
        },
        "Matchmaker": {
            alignment: "Independent",
            description: [
                "Each night chooses two people to go on a date. If those two are the same alignment, they will fall in love.",
                "Wins if all players left alive are in love.",
            ],
        },
        "Prophet": {
            alignment: "Independent",
            description: [
                "Once per game can predict when the game will end.",
                "Wins if they guess correctly.",
            ],
        },
        "Vengeful Spirit": {
            alignment: "Independent",
            description: [
                "If killed by any other players in a way that is not the village vote, will gain the ability to kill a player each night in the graveyard.",
                "Wins if it kills all of its murderers.",
            ],
            graveyardParticipation: "self",
        },
        "Clockmaker": {
            alignment: "Independent",
            description: [
                "Can kill one player each night.",
                "Has a clock that starts at 6.",
                "Whenever they kill a player the clock changes based on that player's alignment.",
                "Goes up by 1 for village, up by 2 for Mafia or Monster, down by 3 for independant.",
                "Wins when if clock strikes 12, gains an extra life at 9, instantly dies at 3."
                ],
        },
    },
    "Split Decision": {
        //Blue
        "Blue Member": {
            alignment: "Blue",
            description: [
                "Wins if the President is not in the same room as the Bomber at the end of the game."
            ]
        },
        "President": {
            alignment: "Blue",
            description: [
                "The Blue team wins if he is in a different room from the Bomber at the end of the game."
            ]
        },
        //Red
        "Red Member": {
            alignment: "Red",
            description: [
                "Wins if the President is in the same room as the Bomber at the end of the game."
            ]
        },
        "Bomber": {
            alignment: "Red",
            description: [
                "The Red team wins if he is in the same room as the Bomber at the end of the game."
            ]
        },
        //Independent
        "Gambler": {
            alignment: "Independent",
            description: [
                "Guesses which team will win after the last round and wins if correct."
            ]
        },
    },
    "Resistance": {
        //Resistance
        "Rebel": {
            alignment: "Resistance",
            description: [
                "Wins if a certain number of missions are successful."
            ]
        },
        "Merlin": {
            alignment: "Resistance",
            description: [
                "Kowns the alignment of all spies.",
                "If the Rebels would win, the spies can guess who Merlin is to win instead."
            ]
        },
        "Percival": {
            alignment: "Resistance",
            description: [
                "Knows who is Merlin."
            ]
        },
        //Spies
        "Spy": {
            alignment: "Spies",
            description: [
                "Wins if a certain number of missions fail."
            ]
        },
        "Oberon": {
            alignment: "Spies",
            description: [
                "Does not know who the other spies are and spies do not know him."
            ]
        },
        "Morgana": {
            alignment: "Spies",
            description: [
                "Appears as Merlin to Percival."
            ]
        },
    },
    "One Night": {
        //Village
        "Villager": {
            alignment: "Village",
            description: [
                "Wins if at least one Werewolf dies or if no one dies if no Werewolves are present."
            ]
        },
        "Hunter": {
            alignment: "Village",
            description: [
                "If executed, the person he voted to execute is also killed."
            ]
        },
        "Mason": {
            alignment: "Village",
            description: [
                "Learns who the other Masons were at the beginning of the night."
            ]
        },
        "Seer": {
            alignment: "Village",
            description: [
                "At the beginning of the night, learns either one player's role or two excess roles."
            ]
        },
        "Robber": {
            alignment: "Village",
            description: [
                "At 12:00, can choose to exchange roles with another player and learn his new role.",
                "Does not perform the action of his new role.",
            ]
        },
        "Troublemaker": {
            alignment: "Village",
            description: [
                "At 1:00, can swap the roles of two other players.",
                "Those players do not perform the actions of their new roles.",
            ]
        },
        "Insomniac": {
            alignment: "Village",
            description: [
                "Learns what her role is after the night is over.",
            ]
        },
        //Werewolves
        "Werewolf": {
            alignment: "Werewolves",
            description: [
                "Learns who the other Werewolves were at the beginning of the night.",
                "If there are no other Werewolves, learns one excess role.",
                "Wins if Werewolves are present but no Werewolves die.",
            ]
        },
        "Minion": {
            alignment: "Werewolves",
            description: [
                "Learns who the Werewolves are at the beginning of the night.",
                "Wins with the Werewolves, and wins if a non-minion player dies when no Werewolves are present.",
            ]
        },
        //Independent
        "Drunk": {
            alignment: "Independent",
            description: [
                "Becomes a random excess role at the end of the night.",
            ]
        },
        "Tanner": {
            alignment: "Independent",
            description: [
                "Wins if he dies.",
                "The Werewolves do not win if he dies.",
                "The Village does not win if he dies and no Werewolves are present.",
            ]
        },
        "Doppelganger": {
            alignment: "Independent",
            description: [
                "At the beginning of the night, copies and becomes the role of another player.",
                "Performs the actions of that role, unless another Doppelganger was chosen.",
                "Her new actions are performed before the player's whose role was copied."
            ]
        },
    },
};

module.exports = roleData;
