import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Host from "./Host";
import { useForm } from "../../../components/Form";
import { useErrorAlert } from "../../../components/Alerts";

import "../../../css/host.css"

export default function HostSplitDecision() {
    const gameType = "Split Decision";
    const [selSetup, setSelSetup] = useState({});
    const [redirect, setRedirect] = useState(false);
    const errorAlert = useErrorAlert();
    const [formFields, updateFormFields] = useForm([
        {
            label: "Setup",
            ref: "setup",
            type: "text",
            disabled: true,
        },
        {
            label: "Private",
            ref: "private",
            type: "boolean"
        },
        {
            label: "Spectating",
            ref: "spectating",
            type: "boolean"
        },
        {
            label: "Voice Chat",
            ref: "voiceChat",
            type: "boolean"
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
            label: "Initial Round Length (minutes)",
            ref: "initRoundLength",
            type: "number",
            value: 3,
            min: 1,
            max: 5
        },
        {
            label: "Hostage Swap Length (minutes)",
            ref: "hostageSwapLength",
            type: "number",
            value: 0.5,
            min: 0.1,
            max: 1,
            step: 0.1
        },
    ]);

	useEffect(() => {
		document.title = "Host Split Decision | EpicMafia";
    }, []);

    function onHostGame() {
        if (selSetup.id)
            axios.post("/game/host", {
                    gameType: gameType,
                    setup: selSetup.id,
                    private: formFields[1].value,
                    spectating: formFields[2].value,
                    voiceChat: formFields[3].value,
                    scheduled: formFields[4].value && (new Date(formFields[5].value)).getTime(),
                    stateLengths: {
                        "Initial Round": formFields[6].value,
                        "Hostage Swap": formFields[7].value
                    }
                })
                .then(res => setRedirect(`/game/${res.data}`))
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