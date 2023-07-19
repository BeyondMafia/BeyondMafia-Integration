import React, { useRef, useEffect, useContext, useState, useReducer } from "react";

import { useSocketListeners, CombinedTextMeetingLayout, TopBar, PlayerList, Timer, SidePanelLayout, ActionButton } from "./Game";
import { NameWithAvatar } from "../User/User";
import { MaxTextInputLength, JottoLegalWords } from "../../Constants";
import { GameContext } from "../../Contexts";
import update from "immutability-helper";

import "../../css/jotto.css";
import "../../css/jotto-mobile.css";

export default function JottoGame(props) {
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

  const gameType = "Jotto";
  const meetings = history.states[stateViewing] ? history.states[stateViewing].meetings : {};
  const stateEvents = history.states[stateViewing] ? history.states[stateViewing].stateEvents : [];
  const stateNames = ["Choose Word", "Guess Word"];
  const audioFileNames = [];
  const audioLoops = [];
  const audioOverrides = [];
  const audioVolumes = [];

  const cheatSheetInit = ["ABCDEFGHJIKLMNOPQRSTUVWXYZ"].reduce((obj, letters) => {
    for (let letter of letters) {
        obj[letter] = "none";
    }
    return obj;
  }, {});
  const [jottoHistory, updateJottoHistory] = useReducer((jottoHistory, action) => {
    let newJottoHistory;
    
    switch (action.type) {
        case "set":
            let stateIds = Object.keys(action.history).sort((a, b) => a - b);

            // Convert History into JottoHistory
            newJottoHistory = { states: {}, cheatsheet: { ...jottoHistory.cheatsheet}};
            for (let state of stateIds) {
                if (action.history[state].extraInfo) {
                    newJottoHistory.states[state] = { ...action.history[state].extraInfo };
                } else {
                    newJottoHistory.states[state] = { guesses: {}, chosenWords: {}, opponents: {} };
                }
            }

            newJottoHistory.currentState = -2;
            if (stateIds[0] != -2)
                newJottoHistory.currentState = stateIds[stateIds.length - 1];
            break;
        case "addState":
            if (!jottoHistory.states[action.state.id]) {
                let prevState;

                if (action.state.id != -2)
                    prevState = action.state.id - 1;
                else
                    prevState = Object.keys(jottoHistory.states).sort((a, b) => b - a)[0];

                // Deep copy old guesses array (no need to deep copy guess objects)
                let deepGuesses = {};
                if (jottoHistory.states[prevState]) {
                    for (let pid in jottoHistory.states[prevState].guesses) {
                        deepGuesses[pid] = [ ...jottoHistory.states[prevState].guesses[pid] ];
                    }
                }

                newJottoHistory = update(jottoHistory, {
                    states: {
                        [action.state.id]: {
                            $set: {
                                guesses: { ...deepGuesses },
                                chosenWords: { ...jottoHistory.states[prevState].chosenWords }, 
                                opponents: { ...jottoHistory.states[prevState].opponents }
                            }
                        }
                    },
                    currentState: {
                        $set: action.state.id
                    }
                });
            }
            else
                newJottoHistory = jottoHistory;
            break;
        case "jottoguess":
            if (jottoHistory.states[jottoHistory.currentState]) {

                newJottoHistory = update(jottoHistory, {
                    states: {
                        [jottoHistory.currentState]: {
                            guesses: {
                                [action.info.playerId]: {
                                    $push: [{
                                        word: action.info.word,
                                        score: action.info.score
                                    }]
                                }
                            }
                        }
                    }
                });
            }
            break;
        case "jottoreveal":
            if (jottoHistory.states[jottoHistory.currentState]) {
                newJottoHistory = update(jottoHistory, {
                    states: {
                        [jottoHistory.currentState]: {
                            chosenWords: {
                                [action.info.playerId]: {
                                    $set: action.info.word
                                }
                            }
                        }
                    }
                });
            }
            break;
        case "jottoinit":
            if (jottoHistory.states[jottoHistory.currentState]) {
                newJottoHistory = update(jottoHistory, {
                    states: {
                        [jottoHistory.currentState]: {
                            guesses: {
                                [action.info.playerId]: {
                                    $set: []
                                }
                            },
                            opponents: {
                                [action.info.playerId]: {
                                    $set: {
                                        attackerId: action.info.attackerId,
                                        targetId: action.info.targetId
                                    }
                                }
                            }
                        }
                    }
                });
            }
            break;
        case "cheatsheet":
            if (jottoHistory.cheatsheet[action.info.letter]) {
                newJottoHistory = update(jottoHistory, {
                    cheatsheet: {
                        [action.info.letter]: {
                            $set: action.info.class
                        }
                    }
                });
            }
            break;
        case "cheatsheetall":
            const cheatSheet = ["ABCDEFGHJIKLMNOPQRSTUVWXYZ"].reduce((obj, letters) => {
                for (let letter of letters) {
                    obj[letter] = action.info.class;
                }
                return obj;
            }, {});

            newJottoHistory = update(jottoHistory, {
                cheatsheet: {
                    $set: cheatSheet
                }
            });
            break;
    }

    return newJottoHistory || jottoHistory;

  }, { states: {}, cheatsheet: cheatSheetInit});;
  
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
    socket.on("history", history => {
        updateJottoHistory({type: "set", history});
    });
    socket.on("state", state => {
        updateJottoHistory({type: "addState", state});
    });

    socket.on("state", state => {
      if (playBellRef.current)
        game.playAudio("bell");

      playBellRef.current = true;
    });

    // Receive guesses
    socket.on("jottoguess", info => {
        updateJottoHistory({ type: "jottoguess", info });
    });

    // Reveal chosenWords
    socket.on("jottoreveal", info => {
        updateJottoHistory({ type: "jottoreveal", info });
    });

    // Receive opponents
    socket.on("jottoinit", info => {
        updateJottoHistory({ type: "jottoinit", info });
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
            <span>J</span>otto
          </div>
        }
        timer={
          <Timer
            timers={game.timers}
            history={history} />
        } />
      <SidePanelLayout
        settings={game.settings}
        gameType={gameType}
        leftPanelContent={
          <>
            <CombinedTextMeetingLayout
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
        mainPanelContent={
          <>
            {stateViewing == -1 &&
                <PlayerList
                    players={players}
                    history={history}
                    gameType={gameType}
                    stateViewing={stateViewing}
                    activity={game.activity} />
            }
            {stateViewing != -1 &&
                <JottoLayout 
                    game={game}
                    socket={game.socket}
                    meetings={meetings}
                    players={players}
                    self={self}
                    history={history}
                    jottoHistory={jottoHistory}
                    updateJottoHistory={updateJottoHistory} 
                    stateViewing={stateViewing}
                    review={game.review}
                    isSpectator={game.isSpectator}
                    activity={game.activity}
                />
            }
          </>
        } />
    </>
  );
}

function JottoLayout(props) {
    let playerColumns = [];
    let selfId = props.self;

    // Put player Guess input on top of their guess history
    const actions = Object.values(props.meetings).reduce((actions, meeting) => {
        if (meeting.voting) {
            let action;
            switch (meeting.inputType) {
                case "text":
                    if (meeting.name === "Guess") {
                        action = 
                            <JottoText
                                key={meeting.id}
                                socket={props.socket}
                                meeting={meeting}
                                players={props.players}
                                self={props.self}
                                history={props.history}
                                stateViewing={props.stateViewing}
                                noLabel />;
                    }
                    break;
            }
            if (action) {
                actions.push(action);
            }
        }
        return actions;
    }, []);

    const omniscient = props.review || props.isSpectator;
    let source = omniscient
        ? props.history.states[props.stateViewing].extraInfo 
        : props.jottoHistory.states[props.stateViewing];
    // Don't show columns on Choose Word
    if (source && props.stateViewing != 0) {
        const opponents = source.opponents;
        const guesses = source.guesses;
        const chosenWords = source.chosenWords;
        if (guesses && chosenWords) {
            for (let pid in props.players) {
                if (!opponents[pid]) { continue; }

                // If not review or postgame, skip if not self or self's attacker
                if (!(omniscient || props.stateViewing === -2)) {
                    if (!opponents[selfId]) { continue; }
                    if (pid !== selfId && pid !== opponents[selfId].attackerId) { continue; }
                }

                let tid = opponents[pid].targetId;

                // Get player's guesses as JottoGuess elements (reverse to make most recent at top)
                let playerGuesses = guesses[pid].map((guess, i) => {
                    return (
                        <JottoGuess 
                            key={i}
                            guess={guess}
                        />
                    );
                })
                .reverse();

                // Get opponent's answer
                let opponentAnswer = "";
                if (chosenWords[tid]) {
                    opponentAnswer = chosenWords[tid];
                }

                let answerLabel  = props.players[tid].name + "'s Word";
                let guessesLabel = props.players[pid].name + "'s Guesses";

                if (selfId) {
                    if (selfId == tid)
                        answerLabel = "Your Word";
                    if (selfId == pid)
                        guessesLabel = "Your Guesses";
                }

                const targetPlayer = props.players[tid];
                playerColumns.push((
                    <React.Fragment key={pid}>
                        <div className={"jotto-column-wrapper " + (opponents[tid].targetId == selfId ? "self-column" : "other-column")}>
                            <NameWithAvatar
                                id={targetPlayer.userId}
                                name={targetPlayer.name}
                                avatar={targetPlayer.avatar}
                                color={targetPlayer.nameColor}
                                active={props.activity.speaking[targetPlayer.id]}
                                noLink
                                newTab />
                            <div className="jotto-answer-display">
                                {actions.length > 0 && opponents[tid].targetId == selfId ? actions[0] : <JottoAnswer word={opponentAnswer} />}
                            </div>
                            <span>{guessesLabel}</span>
                            <div className="jotto-guess-display">
                                {playerGuesses}
                            </div>
                        </div>
                    </React.Fragment>
                ));
            }

            // Put self guesses at left if applicable
            playerColumns.sort(function (a, b) {
                const aIsSelf = a.key == selfId;
                const bIsSelf = b.key == selfId;
                return aIsSelf ? -1 : bIsSelf ?  1 : 0;
            });
        }
    }

    return (
        <>
            <div className="jotto-layout-title">
                {"Jotto"}
            </div>
            <div className="jotto-layout">
                {playerColumns[0]}
                {!(playerColumns.length > 2) &&
                    <JottoActionList
                        socket={props.socket}
                        meetings={props.meetings}
                        players={props.players}
                        self={props.self}
                        history={props.history}
                        jottoHistory={props.jottoHistory}
                        updateJottoHistory={props.updateJottoHistory} 
                        stateViewing={props.stateViewing}
                        review={props.review}
                        isSpectator={props.isSpectator}/>
                }
                {playerColumns.slice(1)}
            </div>
        </>
    );
}


function JottoAnswer(props) {
    let word = props.word;

    let wordArray = word.split("");
    while (wordArray.length < 5) {
        wordArray.push("");
    }
    return (
        <>
            <JottoWord wordArray={wordArray} />
        </>
    )
}

function JottoInput(props) {
    let word = props.word;
    let handleOnChange = props.handleOnChange;

    function forceNoCursorMove(e) {
        if (e.keyCode === 37 ||
                e.keyCode === 38 ||
                e.keyCode === 39 ||
                e.keyCode === 40) {
            e.preventDefault();
        }
    }

    function forceCursorEnd(e) {
        e.preventDefault();
        e.target.focus();
        e.target.setSelectionRange(word.length, word.length);
    }

    let wordArray = word.split("");
    while (wordArray.length < 5) {
        wordArray.push("");
    }
    return (
        <>
            <div className="jotto-input-container">
                <JottoWord wordArray={wordArray} />
                <input 
                    type="text" 
                    value={word} 
                    onKeyDown={forceNoCursorMove}
                    onMouseDown={forceCursorEnd}
                    className="jotto-input" 
                    onChange={handleOnChange} />
            </div>
        </>
    )
}

function JottoGuess(props) {
    let guess = props.guess;
    let word = guess.word;
    let score = guess.score;
    
    function getScoreLevel() {
        let level = "";
        switch(score) {
            case 1:
            case 2:
                level = "low";
                break;
            case 3:
                level = "medium";
                break;
            case 4:
                level = "high";
                break;
            case 5:
                level = "max";
                break;
            case 6:
                level = "winner";
                break;
        }
        return level;
    }

    word = word.split("");
    return (
        <>
            <JottoWord wordArray={word} />
            <span className={"jotto-guess-score " + getScoreLevel()}>{score}</span>
            <br/>
        </>
    )
}

function JottoWord(props) {
    let word = props.wordArray;
    let tiles = word.map((letter, i) => {
        return (
            <div key={i} className="jotto-word-tile">{letter}</div>
        )
    });
    return (
        <>
            <div className="jotto-word">{tiles}</div>
        </>
    )
}

function JottoActionList(props) {
    if (props.review || props.isSpectator) {return (<></>);}

    const actions = Object.values(props.meetings).reduce((actions, meeting) => {
        if (meeting.voting) {
            let action;
            switch (meeting.inputType) {
                case "button":
                    action = 
                        <ActionButton
                            key={meeting.id}
                            socket={props.socket}
                            meeting={meeting}
                            players={props.players}
                            self={props.self}
                            history={props.history}
                            stateViewing={props.stateViewing} />;
                    break;
                case "text":
                    if (meeting.name === "Choose") {
                        action = 
                            <JottoText
                                key={meeting.id}
                                socket={props.socket}
                                meeting={meeting}
                                players={props.players}
                                self={props.self}
                                history={props.history}
                                stateViewing={props.stateViewing} />;
                    }
                    break;
            }
            if (action) {
                actions.push(action);
            }
        }
        return actions;
    }, []);

    return (
        <>
            <div className="jotto-column-wrapper">
                <div className="side-menu-content">
                    {props.stateViewing > 0 &&
                        // Don't show cheat sheet on non-guess state
                        <JottoCheatSheet
                            jottoHistory={props.jottoHistory}
                            updateJottoHistory={props.updateJottoHistory} />
                    }
                    {actions.length > 0 &&
                        <div className="action-list">
                            {actions}
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

function JottoCheatSheet(props) {
    const alphabet = ["ABCDE","FGHIJ","KLMNO","PQRST","UVWXY","Z"];
    const cheatsheet = props.jottoHistory.cheatsheet;

    function handleChangeColor(e) {
        let letter = e.target.getAttribute("data-letter");
        let letterClass = e.target.className.split(" ")[1];

        if (letterClass == "none")
            letterClass = "maybe";
        else if (letterClass == "maybe")
            letterClass = "yes";
        else if (letterClass == "yes")
            letterClass = "no";
        else if (letterClass == "no")
            letterClass = "none";

        props.updateJottoHistory({
            type: "cheatsheet", 
            info: {letter: letter, class: letterClass}
        });
    }

    function handleResetCheatsheet(e) {
        props.updateJottoHistory({
            type: "cheatsheetall", 
            info: {class: "none"}
        });
    }

    let letters = alphabet.map((lettergroup, i) => {
        const letters = lettergroup.split("");
        let letterComponents = letters.map((letter, i) => {
            return (
                <div key={i} 
                     className={"jotto-cheatsheet-letter " + (cheatsheet[letter] ? cheatsheet[letter] : "none")}
                     onClick={handleChangeColor}
                     data-letter={letter}>{letter}</div>
            )
        });

        return (
            <div key={i} className="jotto-cheatsheet-row">{letterComponents}</div>
        )
    });
    return (
        <>
            <div className="jotto-cheatsheet">{letters}</div>
            <button
                className="jotto-cheatsheet-reset btn btn-theme"
                onClick={handleResetCheatsheet}>Reset</button>
        </>
    )
}

function JottoText(props) {
    const meeting = props.meeting;
    const self = props.self;
    
    const disabled = meeting.finished;

    // text settings
    const textOptions = meeting.textOptions || {};
    const minLength = textOptions.minLength || 0;
    const maxLength = textOptions.maxLength || MaxTextInputLength;

    const [textData, setTextData] = useState("");
    const [wordWarning, setWordWarning] = useState("");

    function handleOnChange(e) {
        var textInput = e.target.value;
        // disable new lines by default
        textInput = textInput.replace(/\n/g, " ");

        if (textOptions.alphaOnly) {
            textInput = textInput.replace(/[^a-z]/gi, '');
        }
        if (textOptions.toUpperCase) {
            textInput = textInput.toUpperCase();
        }

        textInput = textInput.substring(0, maxLength);
        setTextData(textInput);
    }

    function handleOnSubmit(e) {
        e.preventDefault();
        if (textData.length < minLength) {
            return;
        }

        if (!JottoLegalWords[textData[0]].includes(textData)) {
            setWordWarning("Not a valid word!");
            setTextData("");
            return;
        }

        setWordWarning("");
        meeting.votes[self] = textData;
        props.socket.send("jottovote", {
            meetingId: meeting.id,
            selection: textData
        });
    }

    return (
        <div className="action">
            <div className="action-name">
                {meeting.actionName}
            </div>
            <form onSubmit={handleOnSubmit}>
                {!disabled &&
                    <JottoInput
                        word={textData}
                        handleOnChange={handleOnChange} />
                }
                {!disabled &&
                    <div
                        type="submit"
                        className="btn btn-theme"
                        onClick={handleOnSubmit}>
                        {textOptions.submit || "Submit"}
                    </div>
                }
            </form>
            {wordWarning}
            {meeting.votes[self]}
        </div>
    );
}
