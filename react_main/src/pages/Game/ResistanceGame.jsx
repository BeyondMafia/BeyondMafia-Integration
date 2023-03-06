import React, { useRef, useEffect, useContext } from "react";

import { useSocketListeners, useStateViewingReducer, ThreePanelLayout, TopBar, TextMeetingLayout, ActionList, PlayerList, Timer, SpeechFilter, Notes } from "./Game";
import { GameContext } from "../../Contexts";

export default function ResistanceGame(props) {
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

	const gameType = "Resistance";
	const meetings = history.states[stateViewing] ? history.states[stateViewing].meetings : {};
	const stateEvents = history.states[stateViewing] ? history.states[stateViewing].stateEvents : [];
	const stateNames = ["Team Selection", "Team Approval", "Mission", "Epilogue"];
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
						<span>R</span>esistance
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