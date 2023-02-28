
import React, { useEffect } from "react";

import { RoleSearch } from "../../../components/Roles";
import { PanelGrid } from "../../../components/Basic";

import "../../../css/learn.css";

export default function LearnMafia(props) {
	const gameType = "Mafia";

	var items = [
		{
			name: "Gun",
			text: "Can be shot once during the day to kill a specific player."
		},
		{
			name: "Armor",
			text: "Saves a player from being killed one time, not including being executed."
		},
		{
			name: "Bomb",
			text: "When a player is killed while holding a bomb, the player who killed them will also die."
		},
		{
			name: "Crystal",
			text: "The holder of the crystal can choose a person each night and if they die, their targets role will be revealed.",
		},
	];

	var mechanics = [
		{
			name: "Whispers",
			text: "Allow players to privately contact another player in the town meeting. If the whisper leaks then everyone will see it."
		},
		{
			name: "Last Wills",
			text: "Allow players to write a message that will be revealed when they die."
		},
		{
			name: "Must Act",
			text: "Players cannot select 'no one' for their actions."
		},
		{
			name: "No Reveal",
			text: "The roles of dead players are not revealed."
		},
		{
			name: "Closed Roles",
			text: "Roles for each alignment are randomly chosen from the pool of roles in the setup."
		},
		{
			name: "Dawn",
			text: "No actions can be taken the first night."
		},
		{
			name: "Full Moon",
			text: "When a Lycan or Werewolf is present in the game, full moons will occur on odd nights."
		},
		{
			name: "Eclipse",
			text: "Occurs during the day due to certain roles, making all votes and speech anonymous."
		},
	];

	var modifiers = [
		{
			name: "Armed",
			text: "Starts with a gun.",
			icon: <div className="icon modifier modifier-Mafia-Armed" />
		},
		{
			name: "Explosive",
			text: "Starts with a bomb.",
			icon: <div className="icon modifier modifier-Mafia-Explosive" />
		},
		{
			name: "Armored",
			text: "Starts with armor.",
			icon: <div className="icon modifier modifier-Mafia-Armored" />
		},
		{
			name: "Exposed",
			text: "Starts revealed to everyone.",
			icon: <div className="icon modifier modifier-Mafia-Exposed" />
		},
		{
			name: "Chameleon",
			text: "Appears as a Villager to investigative roles.",
			icon: <div className="icon modifier modifier-Mafia-Chameleon" />
		},
		{
			name: "Humble",
			text: "Appears as Villager to self with no modifier.",
			icon: <div className="icon modifier modifier-Mafia-Humble" />
		},
		{
			name: "Absent-Minded",
			text: "Appears as Visitor (if Village-aligned) or Trespasser (if Mafia-aligned) to self with no modifier.",
			icon: <div className="icon modifier modifier-Mafia-Absent-Minded" />
		},
		{
			name: "Lone",
			text: "Does not attend the Mafia or Monsters meeting.",
			icon: <div className="icon modifier modifier-Mafia-Lone" />
		},
		{
			name: "Solitary",
			text: "Does not attend Cop or Illuminati meetings.",
			icon: <div className="icon modifier modifier-Mafia-Solitary" />
		},
		{
			name: "Delayed",
			text: "Cannot attend secondary meetings for the first day and night.",
			icon: <div className="icon modifier modifier-Mafia-Delayed" />
		},
		{
			name: "Even",
			text: "Can only attend secondary meetings on even days and nights.",
			icon: <div className="icon modifier modifier-Mafia-Even" />
		},
		{
			name: "Odd",
			text: "Can only attend secondary meetings on odd days and nights.",
			icon: <div className="icon modifier modifier-Mafia-Odd" />
		},
		{
			name: "One Shot",
			text: "Can only perform actions once.",
			icon: <div className="icon modifier modifier-Mafia-One-Shot" />
		},
	];

	useEffect(() => {
		document.title = "Learn Mafia | BeyondMafia";
	}, []);

	return (
		<div className="span-panel main">
			<div className="learn">
				<div className="heading">
					Synopsis
				</div>
				<div className="paragraphs">
					<div className="paragraph">
						Mafia is a game of social deception where an informed minority (the Mafia) compete against the uniformed majority (the Village).
						The Mafia choose one player to kill each night, and they win the game if they successfully outnumber the non-mafia players at any point.
						Everyone votes to execute one person during the day, with the Village aiming to eliminate all mafia members.
					</div>
					<div className="paragraph">
						In addition to the Village and the Mafia, there are two other alignments: Independent and Monsters. Independents are not aligned with a side and usually have their own unique win condition.
						Monsters meet together and win if they reach the majority just like the mafia, but they do not vote to kill someone each night.
					</div>
					<div className="paragraph">
						At the beginning of a game, each player is given a role. This role may grant the player special abilities, usually in the form of actions they can take to aid their side.
						A list of all roles and their abilities can be found below.
					</div>
				</div>
				<div className="heading">
					Roles
				</div>
				<RoleSearch gameType={gameType} />
				<div className="heading">
					Items
				</div>
				<PanelGrid panels={items} />
				<div className="heading">
					Mechanics
				</div>
				<PanelGrid panels={mechanics} />
				<div className="heading">
					Modifiers
				</div>
				<PanelGrid panels={modifiers} />
			</div>
		</div>
	);
}

