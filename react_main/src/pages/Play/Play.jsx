import React, { useState, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Join from "./Join";

import HostMafia from "./Host/HostMafia";
import CreateMafiaSetup from "./CreateSetup/CreateMafiaSetup";
import LearnMafia from "./Learn/LearnMafia";

import HostSplitDecision from "./Host/HostSplitDecision";
import CreateSplitDecisionSetup from "./CreateSetup/CreateSplitDecisionSetup";
import LearnSplitDecision from "./Learn/LearnSplitDecision";

import HostResistance from "./Host/HostResistance";
import CreateResistanceSetup from "./CreateSetup/CreateResistanceSetup";
import LearnResistance from "./Learn/LearnResistance";

import HostOneNight from "./Host/HostOneNight";
import CreateOneNightSetup from "./CreateSetup/CreateOneNightSetup";
import LearnOneNight from "./Learn/LearnOneNight";

import { SubNav } from "../../components/Nav";
import { GameTypes } from "../../Constants";
import { UserContext } from "../../Contexts";

export default function Play(props) {
    const defaultGameType = "Mafia";
    const defaultLobby = "Main";
    const lobbies = ["Main", "Sandbox"];
    const user = useContext(UserContext);
    const [gameType, setGameType] = useState(localStorage.getItem("gameType") || defaultGameType);
    const [lobby, setLobby] = useState(localStorage.getItem("lobby") || defaultLobby);
    const links = [
        {
            text: "Play",
            path: "/play",
            exact: true
        },
        {
            text: "Host",
            path: `/play/host`,
            hide: !user.loggedIn
        },
        {
            text: "Create Setup",
            path: `/play/create`,
            hide: !user.loggedIn
        },
        {
            text: "Learn",
            path: `/play/learn`
        }
    ];

    function onFilterGameType(gameType) {
        setGameType(gameType);
        localStorage.setItem("gameType", gameType);
    }

    function onFilterLobby(lobby) {
        setLobby(lobby);
        localStorage.setItem("lobby", lobby);
    }

    var inLobby = window.location.pathname == "/play";

    if (lobbies.indexOf(lobby) == -1)
        onFilterLobby(defaultLobby);

    return (
        <>
            <SubNav
                links={links}
                showFilter={!inLobby}
                filterSel={inLobby ? lobby : gameType}
                filterOptions={inLobby ? lobbies : GameTypes}
                onFilter={inLobby ? onFilterLobby : onFilterGameType}
                filterIcon={inLobby ? <i className="fas fa-house-user" /> : <i className="fas fa-gamepad" />} />
            <div className="inner-content">
                <Switch>
                    <Route exact path="/play" render={() => <Join lobby={lobby} />} />

                    <Route
                        exact
                        path="/play/host"
                        render={
                            () => {
                                switch (gameType) {
                                    case "Mafia":
                                        return <HostMafia />;
                                    case "Split Decision":
                                        return <HostSplitDecision />;
                                    case "Resistance":
                                        return <HostResistance />;
                                    case "One Night":
                                        return <HostOneNight />;
                                    default:
                                        onFilterGameType(defaultGameType);
                                        return <></>;
                                }
                            }
                        } />

                    <Route
                        exact
                        path="/play/create"
                        render={
                            () => {
                                switch (gameType) {
                                    case "Mafia":
                                        return <CreateMafiaSetup />;
                                    case "Split Decision":
                                        return <CreateSplitDecisionSetup />;
                                    case "Resistance":
                                        return <CreateResistanceSetup />;
                                    case "One Night":
                                        return <CreateOneNightSetup />;
                                    default:
                                        onFilterGameType(defaultGameType);
                                        return <></>;
                                }
                            }
                        } />

                    <Route
                        exact
                        path="/play/learn"
                        render={
                            () => {
                                switch (gameType) {
                                    case "Mafia":
                                        return <LearnMafia />;
                                    case "Split Decision":
                                        return <LearnSplitDecision />;
                                    case "Resistance":
                                        return <LearnResistance />;
                                    case "One Night":
                                        return <LearnOneNight />;
                                    default:
                                        onFilterGameType(defaultGameType);
                                        return <></>;
                                }
                            }
                        } />

                    <Route render={() => <Redirect to="/play" />} />
                </Switch>
            </div>
        </>
    );
}