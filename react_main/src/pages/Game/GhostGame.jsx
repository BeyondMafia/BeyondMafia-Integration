import React, { useRef, useEffect, useContext, useState } from "react";

import { useSocketListeners, useStateViewingReducer, ThreePanelLayout, TopBar, TextMeetingLayout, ActionList, PlayerList, Timer, SpeechFilter, Notes } from "./Game";
import { GameContext } from "../../Contexts";
import { SideMenu } from "./Game";

import "../../css/game.css";
import "../../css/gameGhost.css";

export default function GhostGame(props) {
	const game = useContext(GameContext);

	const history = game.history;
	const updateHistory = game.updateHistory;
	const updatePlayers = game.updatePlayers;
	const stateViewing = game.stateViewing;
	const updateStateViewing = game.updateStateViewing;
	const self = game.self;
	const players = game.players;
	const isSpectator = game.isSpectator;

	const playBellRef = useRef(false);

	const gameType = "Ghost";
	const meetings = history.states[stateViewing] ? history.states[stateViewing].meetings : {};
	const stateEvents = history.states[stateViewing] ? history.states[stateViewing].stateEvents : [];
	const stateNames = ["Night", "Give Clue", "Day", "Guess Word"];
	const audioFileNames = [];
	const audioLoops = [];
	const audioOverrides = [];
	const audioVolumes = [];
	
	// Make player view current state when it changes
	useEffect(() => {
		updateStateViewing({ type: "current" });
	}, [history.currentState]);

	useEffect(() => {
		game.loadAudioFiles(audioFileNames, audioLoops, audioOverrides, audioVolumes);

		// Make game review start at pregame
		if (game.review)
			updateStateViewing({ type: "first" });
	}, []);

	useSocketListeners(socket => {
		socket.on("state", state => {
			if (playBellRef.current)
				game.playAudio("bell");

			playBellRef.current = true;

			// for (let stateName of stateNames)
			// 	if (state.name.indexOf(stateName) == 0)
			// 		game.playAudio(stateName);
		});

		socket.on("winners", winners => {
			// game.stopAudios(stateNames);

			// if (winners.groups.indexOf("Resistance") != -1)
			// 	game.playAudio("resistancewin");
			// else
			// 	game.playAudio("spieswin");
		});
	}, game.socket);

	return (
		<>
			<TopBar
				gameType={gameType}
				setup={game.setup}
				history={history}
				stateViewing={stateViewing}
				updateStateViewing={updateStateViewing}
				players={players}
				socket={game.socket}
				options={game.options}
				spectatorCount={game.spectatorCount}
				setLeave={game.setLeave}
				finished={game.finished}
				review={game.review}
				setShowSettingsModal={game.setShowSettingsModal}
				setRehostId={game.setRehostId}
				dev={game.dev}
				gameName={
					<div className="game-name">
						<span>G</span>host
					</div>
				}
				timer={
					<Timer
						timers={game.timers}
						history={history} />
				} />
			<ThreePanelLayout
				leftPanelContent={
					<>
						<PlayerList
							players={players}
							history={history}
							gameType={gameType}
							stateViewing={stateViewing}
							activity={game.activity} />
						<SpeechFilter
							filters={game.speechFilters}
							setFilters={game.setSpeechFilters}
							stateViewing={stateViewing} />
					</>
				}
				centerPanelContent={
					<>
						<TextMeetingLayout
							socket={game.socket}
							history={history}
							updateHistory={updateHistory}
							players={players}
							stateViewing={stateViewing}
							settings={game.settings}
							filters={game.speechFilters}
							options={game.options}
							agoraClient={game.agoraClient}
							localAudioTrack={game.localAudioTrack}
							setActiveVoiceChannel={game.setActiveVoiceChannel}
							muted={game.muted}
							setMuted={game.setMuted}
							deafened={game.deafened}
							setDeafened={game.setDeafened} />
					</>
				}
				rightPanelContent={
					<>
						<HistoryKeeper
							history={history}
							stateViewing={stateViewing} />
						<ActionList
							socket={game.socket}
							meetings={meetings}
							players={players}
							self={self}
							history={history}
							stateViewing={stateViewing} />
						{!isSpectator &&
							<Notes
								stateViewing={stateViewing} />
						}
					</>
				} />
		</>
	);
}

function HistoryKeeper(props) {
	const history = props.history;

	const stateViewing = props.stateViewing;

	if (stateViewing < 0)
		return <></>;

	const extraInfo = history.states[stateViewing].extraInfo;
	console.log(extraInfo)
	return (
		<SideMenu
			title="Game Info"
			scrollable
			content={
				<>
					<GhostHistory 
						responseHistory={extraInfo.responseHistory}
						currentClueHistory={extraInfo.currentClueHistory}
					/>
				</>
			}
		/>
	);
}

function GhostHistory(props) {
	let responseHistory = props.responseHistory;
	let currentClueHistory = props.currentClueHistory;

	return (
		<>
			<div className="ghost">
				<div className="ghost-current-history">
					<div className="ghost-name"> Current Round </div>
					<ClueHistory clueHistory={currentClueHistory}/>
				</div>
				<div className="ghost-legacy-history">
					<div className="ghost-name"> Past Rounds </div>
					{responseHistory.map(h => {
						switch(h.type) {
							case "clue":
								return <ClueHistory clueHistory={h.data}/>
							case "guess":
								return <GuessHistory guess={h.data} />
						}
					})}
				</div>
			</div>
		</>
	)
}

function GuessHistory(props) {
	let g = props.guess;

	return (
		<div className="ghost-guess">
			<div className="ghost-player-name"> {g.name} </div>
			guesses:
			<div className="ghost-player-input"> {g.guess} </div>
		</div>
	)
}

function ClueHistory(props) {
	let clueHistory = props.clueHistory;
	
	return (
		<> 
			{clueHistory.map(c => (
				<Clue clue={c} /> )
			)} 
		</>
	)
}

function Clue(props) {
	let c = props.clue;

	return (
		<>
			<div className="ghost-clue">
				<div className="ghost-player-name"> {c.name} </div>
				<div className="ghost-player-input"> {c.clue} </div>
			</div>
		</>
	)
}