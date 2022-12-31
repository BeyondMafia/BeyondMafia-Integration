import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, Redirect, useLocation, useHistory } from "react-router-dom";
import axios from "axios";

import { UserContext, PopoverContext, SiteInfoContext } from "../../Contexts"
import Setup from "../../components/Setup"
import { ButtonGroup, getPageNavFilterArg, PageNav, SubNav } from "../../components/Nav"
import { ItemList } from "../../components/Basic"
import { useErrorAlert } from "../../components/Alerts";
import { camelCase } from "../../utils"
import LoadingPage from "../Loading";
import LandingPage from "../Landing";
import Comments from "../Community/Comments";
import { Lobbies } from "../../Constants";

import "../../css/join.css";
import { TopBarLink } from "./Play";

export default function Join(props) {
    const defaultLobby = "All";
    const gameListButtons = ["All", "Open", "In Progress", "Finished"];

    const [listType, setListType] = useState("All");
    const [page, setPage] = useState(1);
    const [games, setGames] = useState([]);
    const location = useLocation();
    const history = useHistory();

    const user = useContext(UserContext);
    const errorAlert = useErrorAlert();
    const params = new URLSearchParams(location.search);
    const [lobby, setLobby] = useState(params.get("lobby") || localStorage.getItem("lobby") || defaultLobby);

    useEffect(() => {
        localStorage.setItem("lobby", lobby);

        if (params.get("lobby") != lobby)
            history.push(location.pathname + `?lobby=${lobby}`);

        document.title = `Play (${lobby}) | BeyondMafia`;
        getGameList(listType, 1);
    }, [location.pathname, lobby]);

    function getGameList(_listType, _page) {
        var filterArg = getPageNavFilterArg(_page, page, games, "endTime");

        if (filterArg == null)
            return;

        filterArg += `&page=${_page}`;
        axios.get(`/game/list?list=${camelCase(_listType)}&lobby=${lobby}&${filterArg}`)
            .then(res => {
                if (res.data.length > 0 || _page == 1) {
                    setListType(_listType);
                    setPage(_page);
                    setGames(res.data);
                }
            })
            .catch(errorAlert);
    }

    if (lobby != "All" && Lobbies.indexOf(lobby) == -1)
        setLobby(defaultLobby);

    if (!user.loaded)
        return <LoadingPage />;

    if (user.loaded && !user.loggedIn)
        return <LandingPage />;

    return (
        <>
            <div className="span-panel main join">
                <div className="left-panel">

                </div>
                <div className="right-panel">
                    <div className="top-bar lobby-list">
                        <TopBarLink
                            text="All"
                            sel={lobby}
                            onClick={() => setLobby("All")} />
                        <TopBarLink
                            text="Main"
                            sel={lobby}
                            onClick={() => setLobby("Main")} />
                        <TopBarLink
                            text="Sandbox"
                            sel={lobby}
                            onClick={() => setLobby("Sandbox")} />
                        <TopBarLink
                            text="Competitive"
                            sel={lobby}
                            onClick={() => setLobby("Competitive")} />
                        <TopBarLink
                            text="Games"
                            sel={lobby}
                            onClick={() => setLobby("Games")} />
                    </div>
                    <Banner lobby={lobby}/>
                    <ItemList
                        className="games"
                        items={games}
                        map={game => (
                            <GameRow
                                game={game}
                                lobby={lobby}
                                refresh={() => getGameList(listType, page)}
                                odd={games.indexOf(game) % 2 == 1}
                                key={game.id} />
                        )}
                        empty="No games" />
                    <PageNav
                        page={page}
                        onNav={(page) => getGameList(listType, page)} />

                </div>
            </div>
            <Comments
                location={lobby == "Main" || lobby == "All" ? "lobby" : `lobby-${lobby}`} />
        </>
    );
}

export function Banner(props) {
    const lobbyString = props.lobby.toLowerCase()
    var lobbyBannerClass = `lobby-banner lobby-banner-${lobbyString}`
    return (
        <div className={lobbyBannerClass}></div>
    )
}

export function GameRow(props) {
    const [redirect, setRedirect] = useState(false);
    const [reserved, setReserved] = useState(props.game.reserved);

    const infoRef = useRef();
    const user = useContext(UserContext);
    const popover = useContext(PopoverContext);
    const siteInfo = useContext(SiteInfoContext);
    const errorAlert = useErrorAlert();

    function onInfoClick(e) {
        e.stopPropagation();
        popover.onClick(
            `/game/${props.game.id}/info`,
            "game",
            infoRef.current,
            `Game ${props.game.id}`,
        );
    }

    var linkPath, buttonText;
    var buttonClass = "btn ";

    switch (props.game.status) {
        case "Open":
            linkPath = `/game/${props.game.id}`;
            buttonClass += "btn-join";

            if (props.game.scheduled <= Date.now())
                buttonText = "Join";
            break;
        case "In Progress":
            if (props.game.spectating || user.perms.canSpectateAny) {
                linkPath = `/game/${props.game.id}`;
                buttonClass += "btn-spectate";
                buttonText = "Spectate";
            }
            else {
                linkPath = "/play";
                buttonClass += "btn-in-progress";
                buttonText = "In Progress";
            }
            break;
        case "Finished":
            linkPath = `/game/${props.game.id}/review`;
            buttonClass += "btn-review";
            buttonText = "Review";
            break;
    }

    function onRehostClick() {
        var stateLengths = {};

        for (let stateName in props.game.stateLengths)
            stateLengths[stateName] = props.game.stateLengths[stateName] / 60000;

        axios.post("/game/host", {
            gameType: props.game.type,
            setup: props.game.setup.id,
            lobby: props.lobby,
            guests: props.game.guests,
            private: false,
            ranked: props.game.ranked,
            spectating: props.game.spectating,
            voiceChat: props.game.voiceChat,
            readyCheck: props.game.readyCheck,
            stateLengths: stateLengths,
            ...JSON.parse(props.game.gameTypeOptions)
        })
            .then(res => setRedirect(`/game/${res.data}`))
            .catch(errorAlert);
    }

    function onReserve() {
        axios.post("/game/reserve", { gameId: props.game.id })
            .then(res => {
                setReserved(!reserved);
                siteInfo.showAlert(res.data, "success");
            })
            .catch(errorAlert);
    }

    function onUnreserve() {
        axios.post("/game/unreserve", { gameId: props.game.id })
            .then(res => {
                setReserved(!reserved);
                siteInfo.showAlert(res.data, "success");
            })
            .catch(errorAlert);
    }
    function onCancel() {
        axios.post("/game/cancel", { gameId: props.game.id })
            .then(res => {
                siteInfo.showAlert(res.data, "success");
                props.refresh();
            })
            .catch(errorAlert);
    }

    if (redirect)
        return <Redirect to={redirect} />

    if (!props.game.setup)
        return <></>;

    return (
        <div className={`row ${props.odd ? "odd" : ""}`}>
            <div className="btns-wrapper">
                {(user.loggedIn || props.type == "Finished") && !props.game.broken && !props.game.private && buttonText &&
                    <Link
                        to={linkPath}
                        className={buttonClass}
                        disabled={props.type == "In Progress" && !props.game.spectating}>
                        {buttonText}
                    </Link>
                }
                {user.loggedIn && props.game.scheduled > Date.now() && !reserved &&
                    <div
                        className="btn btn-theme"
                        onClick={onReserve}>
                        Reserve
                    </div>
                }
                {user.loggedIn && props.game.scheduled > Date.now() && reserved &&
                    <div
                        className="btn btn-theme"
                        onClick={onUnreserve}>
                        Unreserve
                    </div>
                }
                {props.game.scheduled > Date.now() && user.id == props.game.hostId &&
                    <div
                        className="btn btn-theme-sec"
                        onClick={onCancel}>
                        Cancel
                    </div>
                }
                {props.game.broken &&
                    <i className="fas fa-car-crash review-icon" title="Broken" />
                }
                {props.game.private &&
                    <i className="fas fa-lock review-icon" title="Private" />
                }
            </div>
            <div className="player-count-wrapper">
                {props.type != "Finished" &&
                    <PlayerCount game={props.game} />
                }
                {props.type == "Finished" && user.loggedIn && !props.smallSetup &&
                    <div
                        className="btn btn-rehost"
                        onClick={onRehostClick}>
                        Rehost
                    </div>
                }
            </div>
            <div className="setup-wrapper">
                <Setup
                    setup={props.game.setup}
                    maxRolesCount={props.smallSetup ? 3 : 5} />
            </div>
            {!props.smallSetup &&
                <div className="setup-name">
                    {props.game.setup.name}
                </div>
            }
            <div className="game-infos">
                {props.game.ranked &&
                    <i
                        className="ranked fas fa-chart-bar"
                        title="Ranked game" />
                }
                {props.game.voiceChat &&
                    <i
                        className="voice-chat fas fa-microphone"
                        title="Voice chat game" />
                }
                {props.game.status == "Finished" && user.loggedIn && !props.smallSetup &&
                    <i
                        className="rehost fas fa-redo"
                        title="Rehost"
                        onClick={onRehostClick} />
                }
                <i
                    className="game-info fas fa-info-circle"
                    ref={infoRef}
                    onClick={onInfoClick} />
            </div>
        </div>
    );
}

function PlayerCount(props) {
    const game = props.game;
    const circles = [];

    for (let i = 0; i < game.setup.total; i++) {
        circles.push(
            <div
                className={`player-circle ${i < game.players ? "filled" : ""}`}
                key={i} />
        );
    }

    return (
        <div className="player-count">
            {circles}
        </div>
    );
}