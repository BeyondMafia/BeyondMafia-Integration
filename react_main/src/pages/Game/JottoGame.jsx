import React, { useRef, useEffect, useContext, useState } from "react";

import { useSocketListeners, CombinedTextMeetingLayout, TopBar, PlayerList, Timer, SidePanelLayout, ActionButton } from "./Game";
import { MaxTextInputLength, JottoLegalWords } from "../../Constants";
import { GameContext } from "../../Contexts";

import "../../css/jotto.css";

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
        leftPanelContent={
          <>
            <PlayerList
              players={players}
              history={history}
              gameType={gameType}
              stateViewing={stateViewing}
              activity={game.activity} />
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
            <JottoLayout 
              game={game}
              socket={game.socket}
              meetings={meetings}
              players={players}
              self={self}
              history={history}
              stateViewing={stateViewing}
              review={game.review}
              />
          </>
        } />
    </>
  );
}

function JottoLayout(props) {
    let playerColumns = [];
    let selfId = props.self;

    if (props.history.states[props.stateViewing]) {
        const opponents = props.history.states[props.stateViewing].extraInfo["opponents"];
        const guessHistory = props.history.states[props.stateViewing].extraInfo["guessHistory"];
        const wordHistory = props.history.states[props.stateViewing].extraInfo["wordHistory"];
        if (guessHistory && wordHistory) {
            // If reviewing, or if in post game, show all jotto columns
            if (props.review || props.stateViewing === -2) {
                for (let pid in props.players) {
                    let oid = opponents[pid].target;

                    // Get player's guesses as JottoGuess elements (reverse to make most recent at top)
                    let playerGuesses = guessHistory.filter(function (g) {
                        return g.pid == pid;
                    })
                    .map((guess, i) => {
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
                    if (wordHistory.length > 0) {
                        opponentAnswer = wordHistory.filter(function(w) {
                            return w.pid == oid;
                        })[0].word;
                    }
    
                    let answerLabel  = props.players[oid].name + "'s Word";
                    let guessesLabel = props.players[pid].name + "'s Guesses";

                    if (selfId) {
                        if (selfId == oid)
                            answerLabel = "Your Word";
                        if (selfId == pid)
                            guessesLabel = "Your Guesses";
                    }

                    playerColumns.push((
                        <React.Fragment key={pid}>
                            <div className="jotto-column-wrapper">
                                <span>{answerLabel}</span>
                                <div className="jotto-answer-display">
                                    <JottoAnswer word={opponentAnswer} />
                                </div>
                                <span>{guessesLabel}</span>
                                <div className="jotto-guess-display">
                                    {playerGuesses}
                                </div>
                            </div>
                        </React.Fragment>
                    ));
                }
            }

            // If not reviewing, only show player and opponent's columns
            else {
                let otid = opponents[selfId].target;
                let oaid = opponents[selfId].attacker;

                // Get self guesses as JottoGuess elements (reverse to make most recent at top)
                let yourGuesses = guessHistory.filter(function (g) {
                    return g.pid == selfId;
                })
                .map((guess, i) => {
                    return (
                        <JottoGuess 
                            key={i}
                            guess={guess}
                        />
                    );
                })
                .reverse();

                // Get attacker's guesses as JottoGuess elements (reverse to make most recent at top)
                let attackerGuesses = guessHistory.filter(function (g) {
                    return g.pid == oaid;
                })
                .map((guess, i) => {
                    return (
                        <JottoGuess 
                            key={i}
                            guess={guess}
                        />
                    );
                })
                .reverse();

                // Get target answer (blank because user should not know yet)
                let targetAnswer = "";

                // Get self answer
                let yourAnswer = "";
                if (wordHistory.length > 0) {
                    yourAnswer = wordHistory.filter(function(w) {
                        return w.pid == selfId;
                    })[0].word;
                }


                // Columns: TargetAnswer ||  YourAnswer
                //          YourGuesses  ||  AttackerGuesses
                // First Column
                let targetAnswerLabel = props.players[otid].name + "'s Word";
                let yourGuessesLabel = "Your Guesses";
                playerColumns.push((
                    <React.Fragment key={selfId}>
                        <div className="jotto-column-wrapper">
                            <span>{targetAnswerLabel}</span>
                            <div className="jotto-answer-display">
                                <JottoAnswer word={targetAnswer} />
                            </div>
                            <span>{yourGuessesLabel}</span>
                            <div className="jotto-guess-display">
                                {yourGuesses}
                            </div>
                        </div>
                    </React.Fragment>
                ));

                // Second Column
                let yourAnswerLabel = "Your Word";
                let attackerGuessesLabel = props.players[oaid].name + "'s Guesses"
                playerColumns.push((
                    <React.Fragment key={oaid}>
                        <div className="jotto-column-wrapper">
                            <span>{yourAnswerLabel}</span>
                            <div className="jotto-answer-display">
                                <JottoAnswer word={yourAnswer} />
                            </div>
                            <span>{attackerGuessesLabel}</span>
                            <div className="jotto-guess-display">
                                {attackerGuesses}
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
                        stateViewing={props.stateViewing} />
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
            <JottoWord wordArray={wordArray} isAnswer={true} />
            <br/>
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
    let isAnswer = props.isAnswer;
    let tiles = word.map((letter, i) => {
        return (
            <div key={i} className={"jotto-word-tile " + (isAnswer ? "jotto-answer" : "")}>{letter}</div>
        )
    });
    return (
        <>
            <div className={"jotto-word " + (isAnswer ? "jotto-answer" : "")}>{tiles}</div>
        </>
    )
}

function JottoActionList(props) {
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
                    action = 
                        <JottoText
                            key={meeting.id}
                            socket={props.socket}
                            meeting={meeting}
                            players={props.players}
                            self={props.self}
                            history={props.history}
                            stateViewing={props.stateViewing} />;
                    break;
            }
            actions.push(action);
        }
        return actions;
    }, []);

    return (
        <>
            {actions.length > 0 &&
                <div className="side-menu-content">
                    <div className="action-list">
                        {actions}
                    </div>
                </div>
            }
        </>
    );
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
        props.socket.send("jottowordsubmit", {
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
            <br />
            {meeting.votes[self]}
        </div>
    );
}
