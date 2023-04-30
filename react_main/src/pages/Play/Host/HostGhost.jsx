import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Host from "./Host";
import { useForm } from "../../../components/Form";
import { useErrorAlert } from "../../../components/Alerts";
import { SiteInfoContext } from "../../../Contexts";
import { Lobbies } from "../../../Constants";

import "../../../css/host.css"

export default function HostGhost() {
    const gameType = "Ghost";
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
            value: localStorage.getItem("lobby") || "Games",
            options: Lobbies.map(lobby => ({ label: lobby, value: lobby })),
        },
        {
            label: "Private",
            ref: "private",
            type: "boolean"
        },
        {
            label: "Allow Guests",
            ref: "guests",
            type: "boolean"
        },
        {
            label: "Spectating",
            ref: "spectating",
            type: "boolean"
        },
        // {
        //     label: "Voice Chat",
        //     ref: "voiceChat",
        //     type: "boolean"
        // },
        {
            label: "Scheduled",
            ref: "scheduled",
            type: "boolean"
        },
        {
            label: "Ready Check",
            ref: "readyCheck",
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
            label: "Night Length (minutes)",
            ref: "nightLength",
            type: "number",
            value: 1,
            min: 0.5,
            max: 2,
            step: 0.5,
        },
        {
            label: "Give Clue Length (minutes)",
            ref: "giveClueLength",
            type: "number",
            value: 2,
            min: 1,
            max: 3,
            step: 0.5,
        },
        {
            label: "Day Length (minutes)",
            ref: "dayLength",
            type: "number",
            value: 5,
            min: 2,
            max: 30,
            step: 1
        },
    ]);

    useEffect(() => {
        document.title = "Host Ghost | BeyondMafia";
    }, []);

    function onHostGame() {
        var scheduled = formFields[6].value;

        if (selSetup.id)
            axios.post("/game/host", {
                gameType: gameType,
                setup: selSetup.id,
                lobby: getFormFieldValue("lobby"),
                private: getFormFieldValue("private"),
                guests: getFormFieldValue("guests"),
                spectating: getFormFieldValue("spectating"),
                // voiceChat: getFormFieldValue("voiceChat"),
                scheduled: scheduled && (new Date(getFormFieldValue("startDate"))).getTime(),
                readyCheck: getFormFieldValue("readyCheck"),
                stateLengths: {
                    "Night": getFormFieldValue("nightLength"),
                    "Give Clue": getFormFieldValue("giveClueLength"),
                    "Day": getFormFieldValue("dayLength"),
                }
            })
                .then(res => {
                    if (scheduled) {
                        siteInfo.showAlert(`Game scheduled.`, "success");
                        setRedirect("/");
                    }
                    else
                        setRedirect(`/game/${res.data}`)
                })
                .catch(errorAlert);
        else
            errorAlert("You must choose a setup");
    }

    function getFormFieldValue(ref) {
        for (let field of formFields)
            if (field.ref == ref)
                return field.value;
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