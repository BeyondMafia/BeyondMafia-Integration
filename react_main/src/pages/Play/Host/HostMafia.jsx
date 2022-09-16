import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Host from "./Host";
import { useForm } from "../../../components/Form";
import { useErrorAlert } from "../../../components/Alerts";
import { SiteInfoContext } from "../../../Contexts";
import { Lobbies } from "../../../Constants";

import "../../../css/host.css"

export default function HostMafia() {
    const gameType = "Mafia";
    const [selSetup, setSelSetup] = useState({});
    const [redirect, setRedirect] = useState(false);
    const siteInfo = useContext(SiteInfoContext);
    const errorAlert = useErrorAlert();
    const [formFields, updateFormFields] = useForm([
        {
            label: "Setup",
            ref: "setup",
            type: "text",
            disabled: true,
        },
        {
            label: "Lobby",
            ref: "lobby",
            type: "select",
            value: localStorage.getItem("lobby") || "Main",
            options: Lobbies.map(lobby => ({ label: lobby, value: lobby })),
        },
        {
            label: "Private",
            ref: "private",
            type: "boolean",
            showIf: "!ranked"
        },
        {
            label: "Allow Guests",
            ref: "guests",
            type: "boolean",
            showIf: "!ranked"
        },
        {
            label: "Ranked",
            ref: "ranked",
            type: "boolean",
            showIf: ["!private", "!spectating", "!voiceChat", "!guests"]
        },
        {
            label: "Spectating",
            ref: "spectating",
            type: "boolean",
            showIf: "!ranked"
        },
        {
            label: "Voice Chat",
            ref: "voiceChat",
            type: "boolean",
            showIf: "!ranked"
        },
        {
            label: "Scheduled",
            ref: "scheduled",
            type: "boolean"
        },
        {
            label: "Start Date",
            ref: "startDate",
            type: "datetime-local",
            showIf: "scheduled",
            value: Date.now() + (6 * 60 * 1000),
            min: Date.now() + (6 * 60 * 1000),
            max: Date.now() + (4 * 7 * 24 * 60 * 60 * 1000)
        },
        {
            label: "Day Length (minutes)",
            ref: "dayLength",
            type: "number",
            value: 10,
            min: 1,
            max: 30
        },
        {
            label: "Night Length (minutes)",
            ref: "nightLength",
            type: "number",
            value: 2,
            min: 1,
            max: 10
        }
    ]);

    useEffect(() => {
        document.title = "Host Mafia | BeyondMafia";
    }, []);

    function onHostGame() {
        var scheduled = formFields[7].value;

        if (selSetup.id)
            axios.post("/game/host", {
                gameType: gameType,
                setup: selSetup.id,
                lobby: formFields[1].value,
                private: formFields[2].value,
                guests: formFields[3].value,
                ranked: formFields[4].value,
                spectating: formFields[5].value,
                voiceChat: formFields[6].value,
                scheduled: scheduled && (new Date(formFields[8].value)).getTime(),
                stateLengths: {
                    "Day": formFields[9].value,
                    "Night": formFields[10].value
                }
            })
                .then(res => {
                    if (scheduled) {
                        siteInfo.showAlert(`Game scheduled.`, "success");
                        setRedirect("/");
                    }
                    else
                        setRedirect(`/game/${res.data}`);
                })
                .catch(errorAlert);
        else
            errorAlert("You must choose a setup");
    }

    if (redirect)
        return <Redirect to={redirect} />

    return (
        <Host
            gameType={gameType}
            selSetup={selSetup}
            setSelSetup={setSelSetup}
            formFields={formFields}
            updateFormFields={updateFormFields}
            onHostGame={onHostGame} />
    );
}