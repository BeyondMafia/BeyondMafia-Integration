import React, { useState, useContext, useRef, useEffect, useLayoutEffect } from "react";
import { Route, Link, NavLink, Switch, Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import update from "immutability-helper";

import { UserContext, SiteInfoContext, PopoverContext, useSiteInfo } from "./Contexts";
import { AlertList, useErrorAlert } from "./components/Alerts";
import { NotificationHolder, useOnOutsideClick, Time } from "./components/Basic";
import { Nav } from "./components/Nav";
import Game from "./pages/Game/Game";
import Play from "./pages/Play/Play";
import Community from "./pages/Community/Community";
import Bots from "./pages/Bots/Bots";
import Signin from "./pages/Signin/Signin";
import User, { Avatar, useUser } from "./pages/User/User";
import Legal from "./pages/Legal/Legal";
import Popover, { usePopover } from "./components/Popover";
import Chat from "./pages/Chat/Chat";

import "./css/main.css";
import { useReducer } from "react";

function Main() {
    var cacheVal = window.localStorage.getItem("cacheVal");

    if (!cacheVal) {
        cacheVal = Date.now();
        window.localStorage.setItem("cacheVal", cacheVal);
    }

    const user = useUser();
    const siteInfo = useSiteInfo({
        alerts: [],
        cacheVal
    });
    const popover = usePopover(siteInfo);
    const errorAlert = useErrorAlert(siteInfo);

    function onGameLeave(index) {
        axios.post("/game/leave")
            .then(() => {
                siteInfo.hideAlert(index);
            })
            .catch(errorAlert);
    }

    useEffect(() => {
        async function getInfo() {
            try {
                var res = await axios.get("/user/info")
    
                if (res.data.id) {
                    res.data.loggedIn = true;
                    res.data.loaded = true;
                    res.data.rank = Number(res.data.rank);
                    user.set(res.data);

                    var referrer = window.localStorage.getItem("referrer");

                    if (referrer) {
                        axios.post("/user/referred", { referrer });
                        window.localStorage.removeItem("referrer");
                    }
                }
                else
                    user.clear();
    
                if (res.data.nameChanged == false) {
                    siteInfo.showAlert(() => (
                        <div>
                            New account created, you can change your username once in your <Link to={`/user/settings`}>settings</Link>.
                        </div>
                    ), "basic", true);
                }
    
                if (res.data.inGame) {
                    siteInfo.showAlert(index => (
                        <div>
                            Return to game <Link to={`/game/${res.data.inGame}`}>{res.data.inGame}</Link> or <a onClick={() => onGameLeave(index)}>leave</a>.
                        </div>
                    ), "basic", true);
                }

                res = await axios.get("/roles/all");
                siteInfo.update("roles", res.data);
            }
            catch (e) {
                errorAlert(e);
            }
    
        }

        getInfo();
        axios.post("/user/online");

        var onlineInterval = setInterval(() => {
            axios.post("/user/online");
        }, 1000 * 30);

        return () => {
            clearInterval(onlineInterval);
        };
    }, []);

    return (
        <UserContext.Provider value={user}>
            <SiteInfoContext.Provider value={siteInfo}>
                <PopoverContext.Provider value={popover}>
                    <Switch>
                        <Route path="/game">
                            <Game />
                        </Route>
                        <Route path="/">
                            <div className="site-wrapper">
                                <div className="main-container">
                                    <Header />
                                    <div className="inner-container">
                                        <Switch>
                                            <Route path="/play" render={() => <Play />} />
                                            <Route path="/community" render={() => <Community />} />
                                            <Route path="/bots" render={() => <Bots />} />
                                            <Route path="/signin" render={() => <Signin />} />
                                            <Route path="/user" render={() => <User />} />
                                            <Route path="/legal" render={() => <Legal />} />
                                            <Route render={() => <Redirect to="/play" />} />
                                        </Switch>
                                    </div>
                                    <Footer />
                                    <AlertList />
                                    <Chat />
                                </div>
                            </div>
                        </Route>
                    </Switch>
                    <Popover />
                </PopoverContext.Provider>
            </SiteInfoContext.Provider>
        </UserContext.Provider>
    );
}

function Header(props) {
    const user = useContext(UserContext);

    return (
        <div className="header">
            <Link to="/" className="logo-wrapper">
                <div className="logo" />
            </Link>
            <div className="nav-wrapper">
                <Nav>
                    <NavLink to="/play">Play</NavLink>
                    <NavLink to="/community">Community</NavLink>
                    <a href="https://wiki.epicmafia.org">Wiki</a>
                    {/* <a href="https://discord.gg/6MeWWHx">Community</a> */}
                    {/* <NavLink to="/bots">Bots</NavLink> */}
                    {!user.loggedIn &&
                        <NavLink to="/signin" className="nav-link">Sign In</NavLink>
                    }
                    {user.loggedIn &&
                        <>
                            <SiteNotifs />
                            <Link to="/user" className="profile-link">
                                <Avatar
                                    id={user.id}
                                    name={user.name}
                                    hasImage={user.avatar} />
                            </Link>
                        </>

                    }
                </Nav>
            </div>
        </div>
    );
}

function SiteNotifs() {
    const [showNotifList, setShowNotifList] = useState(false);
    const [notifInfo, updateNotifInfo] = useNotifInfoReducer();
    const [nextRestart, setNextRestart] = useState();
    const siteInfo = useContext(SiteInfoContext);
    const history = useHistory();

    const bellRef = useRef();
    const notifListRef = useRef();

    useOnOutsideClick([bellRef, notifListRef], () => setShowNotifList(false));

    useEffect(() => {
        getNotifs();
        var notifGetInterval = setInterval(() => getNotifs(), 10 * 1000);
        return () => clearInterval(notifGetInterval);
    }, []);

    useEffect(() => {
        if (showNotifList)
            viewedNotifs();
    }, [notifInfo.notifs]);

    useEffect(() => {
        if (nextRestart && nextRestart > Date.now()) {
            var restartMinutes = Math.ceil((nextRestart - Date.now()) / 1000 / 60);
            siteInfo.showAlert(`The server will be restarting in ${restartMinutes} minutes.`, "basic", true);
        }
    }, [nextRestart]);

    useLayoutEffect(() => {
        if (!showNotifList)
            return;

        const listRect = notifListRef.current.getBoundingClientRect();
        const listRight = listRect.left + listRect.width;

        if (listRight > window.innerWidth)
            notifListRef.current.style.left = (window.innerWidth - listRight) + "px";

        notifListRef.current.style.visibility = "visible";
    });

    function getNotifs() {
        axios.get("/notifs")
            .then(res => {
                var nextRestart = res.data[0];
                var notifs = res.data.slice(1);

                setNextRestart(nextRestart);

                updateNotifInfo({
                    type: "add",
                    notifs: notifs
                });
            })
            .catch(() => { });
    }

    function viewedNotifs() {
        axios.post("/notifs/viewed")
            .then(() => {
                updateNotifInfo({ type: "viewed" });
            })
            .catch(() => { });
    }

    function onShowNotifsClick() {
        setShowNotifList(!showNotifList);

        if (!showNotifList && notifInfo.unread > 0)
            viewedNotifs();
    }

    function onNotifClick(e, notif) {
        if (!notif.link)
            e.preventDefault();
        else if (window.location.pathname == notif.link.split("?")[0])
            history.go(0);
    }

    const notifs = notifInfo.notifs.map(notif => (
        <Link
            className="notif"
            key={notif.id}
            to={notif.link}
            onClick={e => onNotifClick(e, notif)}>
            {notif.icon &&
                <i className={`fas fa-${notif.icon}`} />
            }
            <div className="info">
                <div className="time">
                    <Time
                        millisec={Date.now() - notif.date}
                        suffix=" ago" />
                </div>
                <div className="content">
                    {notif.content}
                </div>
            </div>
        </Link>
    ));

    return (
        <div className="notifs-wrapper">
            <NotificationHolder
                lOffset
                notifCount={notifInfo.unread}
                onClick={onShowNotifsClick}
                fwdRef={bellRef}>
                <i className="fas fa-bell" />
            </NotificationHolder>
            {showNotifList &&
                <div
                    className="notif-list"
                    ref={notifListRef}>
                    {notifs}
                    {notifs.length == 0 &&
                        "No unread notifications"
                    }
                </div>
            }
        </div>
    );
}

function useNotifInfoReducer() {
    return useReducer((notifInfo, action) => {
        var newNotifInfo;

        switch (action.type) {
            case "add":
                var existingNotifIds = notifInfo.notifs.map(notif => notif.id);
                var newNotifs = action.notifs.filter(notif => existingNotifIds.indexOf(notif.id) == -1);

                newNotifInfo = update(notifInfo, {
                    notifs: {
                        $set: newNotifs.concat(notifInfo.notifs)
                    },
                    unread: {
                        $set: notifInfo.unread + newNotifs.length
                    }
                });

                // if (newNotifs.length > 0 && document.hidden && document.title.indexOf("🔴") == -1)
                //     document.title = document.title + "🔴";
                break;
            case "viewed":
                newNotifInfo = update(notifInfo, {
                    unread: {
                        $set: 0
                    }
                });
                break;
        }

        return newNotifInfo || notifInfo;
    }, { notifs: [], unread: 0 });
}

function Footer() {
    let year = (new Date()).getYear() + 1900;

    return (
        <div className="footer">
            <div className="footer-inner">
                <p>© {year} EpicMafia</p>
            </div>
        </div>
    );
}

export default Main;
