import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import CreateSetup from "./CreateSetup";
import { SiteInfoContext } from "../../../Contexts";
import { useForm } from "../../../components/Form";
import { useErrorAlert } from "../../../components/Alerts";

export default function CreateGhostSetup() {
	const gameType = "Ghost";
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const errorAlert = useErrorAlert();
	const [formFields, updateFormFields, resetFormFields] = useForm([
		{
			label: "Setup Name",
			ref: "name",
			type: "text"
		},
		{
			label: "Word Length",
			ref: "wordLength",
			type: "number",
			value: "5",
			min: "4",
			max: "15",
		},
		{
			label: "Town Word",
			ref: "townWord",
			type: "text"
		},
		{
			label: "Fool Word",
			ref: "foolWord",
			type: "text"
		},
	]);
	const formFieldValueMods = {};

	const siteInfo = useContext(SiteInfoContext);

	useEffect(() => {
		document.title = "Create Ghost Setup | BeyondMafia";
	}, []);

	function onCreateSetup(roleData, editing, setRedirect) {
		axios.post("/setup/create", {
			gameType: gameType,
			roles: roleData.roles,
			name: formFields[0].value,
			startState: "Night",
			wordLength: Number(formFields[1].value),
			townWord: formFields[2].value,
			foolWord: formFields[3].value,
			whispers: "false",
			leakPercentage: 100,
			editing: editing,
			id: params.get("edit")
		})
			.then(res => {
				siteInfo.showAlert(`${editing ? "Edited" : "Created"} setup '${formFields[0].value}'`, "success");
				setRedirect(res.data);
			})
			.catch(errorAlert);
	}

	return (
		<CreateSetup
			gameType={gameType}
			formFields={formFields}
			updateFormFields={updateFormFields}
			resetFormFields={resetFormFields}
			closedField={{"value": false}}
			formFieldValueMods={formFieldValueMods}
			onCreateSetup={onCreateSetup} />
	);
}