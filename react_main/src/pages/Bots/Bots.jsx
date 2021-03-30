import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import DiscordBot from "./DiscordBot";
import { SubNav } from "../../components/Nav";

import "../../css/bots.css";

export default function Legal(props) {
    const links = [
        {
            text: "Discord",
            path: "/bots/discord",
            exact: true
        }
    ];

    return (
        <>
            <SubNav links={links} />
            <div className="inner-content">
                <Switch>
                    <Route exact path="/bots/discord" render={() => <DiscordBot />} />
                    <Route render={() => <Redirect to="/bots/discord" />} />
                </Switch>
            </div>
        </>
    );
}