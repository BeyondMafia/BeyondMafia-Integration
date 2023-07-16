import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Host from "./Host";
import { useForm } from "../../../components/Form";
import { useErrorAlert } from "../../../components/Alerts";
import { SiteInfoContext } from "../../../Contexts";
import { Lobbies } from "../../../Constants";

import "../../../css/host.css"

export default function HostJotto() {
    const gameType = "Jotto";
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
            value: "Games",
            options: [{ label: "Games", value: "Games" }],
        },
        {
            label: "Private",
            ref: "private",
            value: false,
            type: "boolean",
        },
        {
            label: "Allow Guests",
            ref: "guests",
            value: false,
            type: "boolean",
        },
        {
            label: "Spectating",
            ref: "spectating",
            value: false,
            type: "boolean",
        },
        {
            label: "Word Selection Length (minutes)",
            ref: "choosingLength",
            type: "number",
            value: 2,
            min: 1,
            max: 5
        },
        {
            label: "Word Guessing Length (minutes)",
            ref: "guessingLength",
            type: "number",
            value: 2,
            min: 1,
            max: 5
        }
    ]);

    useEffect(() => {
        document.title = "Host Jotto | BeyondMafia";
    }, []);

    function onHostGame() {
        var lobby = "Games";
        axios.post("/game/host", {
            gameType: gameType,
            lobby: lobby,
            setup: selSetup.id,
            private: getFormFieldValue("private"),
            guests: getFormFieldValue("guests"),
            spectating: getFormFieldValue("spectating"),
            readyCheck: false,
            stateLengths: {
                "Choose Word": getFormFieldValue("choosingLength"),
                "Guess Word": getFormFieldValue("guessingLength")
            },
        })
            .then(res => {
                setRedirect(`/game/${res.data}`);
            })
            .catch(errorAlert);
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