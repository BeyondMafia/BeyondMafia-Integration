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

    const defaults = JSON.parse(localStorage.getItem("mafiaHostOptions") || null) ||
        { private: false, guests: false, ranked: false, spectating: false, voiceChat: false, scheduled: false, readyCheck: false, dayLength: 10, nightLength: 2, extendLength: 3 };
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
            value: defaults.private,
            showIf: "!ranked"
        },
        {
            label: "Allow Guests",
            ref: "guests",
            type: "boolean",
            value: defaults.guests,
            showIf: "!ranked"
        },
        {
            label: "Ranked",
            ref: "ranked",
            type: "boolean",
            value: defaults.ranked,
            showIf: ["!private", "!spectating", "!voiceChat", "!guests"]
        },
        {
            label: "Spectating",
            ref: "spectating",
            type: "boolean",
            value: defaults.spectating,
            showIf: "!ranked"
        },
        // {
        //     label: "Voice Chat",
        //     ref: "voiceChat",
        //     type: "boolean",
        //     value: defaults.voiceChat,
        //     showIf: "!ranked"
        // },
        // {
        //     label: "Scheduled",
        //     ref: "scheduled",
        //     value: defaults.scheduled,
        //     type: "boolean"
        // },
        // {
        //     label: "Start Date",
        //     ref: "startDate",
        //     type: "datetime-local",
        //     showIf: "scheduled",
        //     value: Date.now() + (6 * 60 * 1000),
        //     min: Date.now() + (6 * 60 * 1000),
        //     max: Date.now() + (4 * 7 * 24 * 60 * 60 * 1000)
        // },
        {
            label: "Ready Check",
            ref: "readyCheck",
            value: defaults.readyCheck,
            type: "boolean"
        },
        {
            label: "Day Length (minutes)",
            ref: "dayLength",
            type: "number",
            value: defaults.dayLength,
            min: 1,
            max: 30
        },
        {
            label: "Night Length (minutes)",
            ref: "nightLength",
            type: "number",
            value: defaults.nightLength,
            min: 1,
            max: 10
        },
        {
            label: "Extension Length (minutes)",
            ref: "extendLength",
            type: "number",
            value: defaults.extendLength,
            min: 1,
            max: 5
        }
    ]);

    useEffect(() => {
        document.title = "Host Mafia | BeyondMafia";
    }, []);

    function onHostGame() {
        // var scheduled = getFormFieldValue("scheduled");
        var lobby = getFormFieldValue("lobby");

        if (lobby == "All")
            lobby = "Main";

        if (selSetup.id) {
            axios.post("/game/host", {
                gameType,
                lobby,
                setup: selSetup.id,
                private: getFormFieldValue("private"),
                guests: getFormFieldValue("guests"),
                ranked: getFormFieldValue("ranked"),
                spectating: getFormFieldValue("spectating"),
                // voiceChat: getFormFieldValue("voiceChat"),
                // scheduled: scheduled && (new Date(getFormFieldValue("startDate"))).getTime(),
                readyCheck: getFormFieldValue("readyCheck"),
                stateLengths: {
                    "Day": getFormFieldValue("dayLength"),
                    "Night": getFormFieldValue("nightLength")
                },
                extendLength: getFormFieldValue("extendLength"),
            })
                .then(res => {
                    // if (scheduled) {
                    //     siteInfo.showAlert(`Game scheduled.`, "success");
                    //     setRedirect("/");
                    // }
                    // else
                    setRedirect(`/game/${res.data}`);
                })
                .catch(errorAlert);

            defaults.private = getFormFieldValue("private");
            defaults.guests = getFormFieldValue("guests");
            defaults.ranked = getFormFieldValue("ranked");
            defaults.spectating = getFormFieldValue("spectating");
            // defaults.voiceChat = getFormFieldValue("voiceChat");
            // defaults.scheduled = getFormFieldValue("scheduled");
            defaults.readyCheck = getFormFieldValue("readyCheck");
            defaults.dayLength = getFormFieldValue("dayLength");
            defaults.nightLength = getFormFieldValue("nightLength");
            defaults.extendLength = getFormFieldValue("extendLength");
            localStorage.setItem("mafiaHostOptions", JSON.stringify(defaults));
        }
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