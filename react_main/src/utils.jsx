export function hyphenDelimit(roleName) {
	roleName = roleName.slice();

	for (let i = 0; i < roleName.length; i++) {
		if (roleName[i] == " ")
			roleName = roleName.replace(" ", "-");
	}

	return roleName;
}

export function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.substring(1);
}

export function camelCase(string) {
	let subStrings = string.toLowerCase().split(" ");
	let result = "";

	for (let i = 0; i < subStrings.length; i++) {
		if (i == 0)
			result += subStrings[i];
		else
			result += subStrings[i].charAt(0).toUpperCase() + subStrings[i].substring(1);
	}

	return result;
}

export function pascalCase(string) {
	var parts = string.split(" ");
	var res = "";

	for (let i = 0; i < parts.length; i++) {
		let part = parts[i];
		res += (part[0].toUpperCase() + part.slice(1, part.length));
	}

	return res;
}

export function replaceAll(string, from, to) {
	while (string.indexOf(from) != -1)
		string = string.replace(from, to);

	return string;
}

export function pad(value, amt, char) {
	while (value.length < amt)
		value = char + value;

	return value;
}

export function dateToHTMLString(date) {
	if (!date)
		return "";
	else if (typeof date == "string")
		return date;

	date = (new Date(date));

	var day = date.toLocaleDateString();
	var time = date.toTimeString();
	
	day = day.split("/");
	day = pad(day[2], 2, "0") + "-" + pad(day[0], 2, "0") + "-" + pad(day[1], 2, "0");

	time = time.split(":");
	time = time[0] + ":" + time[1];

	date = day + "T" + time;
	return date;
}