import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import { UserContext, PopoverContext, SiteInfoContext } from "../../Contexts"
import Setup from "../../components/Setup"
import { ButtonGroup, PageNav, SubNav } from "../../components/Nav"
import { ItemList } from "../../components/Basic"
import { useErrorAlert } from "../../components/Alerts";
import { camelCase } from "../../utils"
import LoadingPage from "../Loading";
import LandingPage from "../Landing";
import Comments from "../Community/Comments";

import "../../css/play.css";

export default function Join(props) {
    const lobby = props.lobby;

    const [listType, setListType] = useState("Open");
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [games, setGames] = useState([]);

    const user = useContext(UserContext);
    const errorAlert = useErrorAlert();

    useEffect(() => {
        document.title = `Play (${lobby}) | EpicMafia`;
        getGameList(listType, 1);
        setPage(1);
    }, [lobby]);

    function getGameList(listType, page) {
        axios.get(`/game/list?list=${camelCase(listType)}&page=${page}&lobby=${lobby}`)
            .then(res => {
                setListType(listType);
                setPage(page);
                setGames(res.data.games);
                setPageCount(res.data.pages);
            })
            .catch(errorAlert);
    }

    function onGameListNavClick(listType) {
        getGameList(listType, 1);
    }

    const gameListButtons = ["Open", "In Progress", "Finished"];

    if (!user.loaded)
        return <LoadingPage />;

    if (user.loaded && !user.loggedIn)
        return <LandingPage />;

    return (
        <>
            <div className="span-panel">
                <div className="top-bar">
                    <div className="btn-group-wrapper">
                        <ButtonGroup sel={listType} buttons={gameListButtons} onClick={onGameListNavClick} />
                        <i className="refresh-games fas fa-sync-alt" onClick={() => getGameList(listType, page)} />
                    </div>
                </div>
                <ItemList
                    items={games}
                    map={game => (
                        <GameRow
                            game={game}
                            type={listType}
                            refresh={() => getGameList(listType, page)}
                            key={game.id} />
                    )}
                    empty="No games" />
                <PageNav
                    page={page}
                    maxPage={pageCount}
                    onNav={(page) => getGameList(listType, page)} />
            </div>
            <Comments location={lobby == "Main" ? "lobby" : `lobby-${lobby}`} />
        </>
    );
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

    switch (props.type) {
        case "Open":
            linkPath = `/game/${props.game.id}`;
            buttonClass += "btn-theme";

            if (props.game.scheduled <= Date.now())
                buttonText = "Join";
            break;
        case "In Progress":
            if (props.game.spectating || user.perms.canSpectateAny) {
                linkPath = `/game/${props.game.id}`;
                buttonClass += "btn-theme";
                buttonText = "Spectate";
            }
            else {
                linkPath = "/play";
                buttonClass += "btn-theme";
                buttonText = "In Progress";
            }
            break;
        case "Finished":
            linkPath = `/game/${props.game.id}/review`;
            buttonClass += "btn-theme";
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
            private: false,
            ranked: props.game.ranked,
            spectating: props.game.spectating,
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
        <div className="game-row">
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
                <i className="fas fa-car-crash review-icon" />
            }
            {props.game.private &&
                <i className="fas fa-lock review-icon" />
            }
            {props.type == "Finished" && user.loggedIn && !props.smallSetup &&
                <div
                    className="btn btn-theme-sec btn-rehost"
                    onClick={onRehostClick}>
                    Rehost
                </div>
            }
            <Setup
                setup={props.game.setup}
                maxRolesCount={props.smallSetup ? 3 : 5} />
            {props.type == "Open" && props.game.scheduled <= Date.now() &&
                <div className="player-count">
                    {props.game.players} / {props.game.setup.total}
                </div>
            }
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
            <i
                className="game-info fas fa-info-circle"
                ref={infoRef}
                onClick={onInfoClick} />
        </div>
    );
}