import React from "react";

export default function DiscordBot() {
	return (
		<div class="span-panel bots">
			<a class="btn-theme add-bot" href="https://discordapp.com/api/oauth2/authorize?client_id=458163181517537290&scope=bot&permissions=19456">Add EpicMafia</a>
			<div class="bot-info">to your server</div>
			<table>
				<thead>
					<tr>
						<th>Command</th>
						<th>Usage</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>mafia</th>
						<td>arc.mafia [optional setup name]</td>
						<td class="desc">Creates a new mafia game.</td>
					</tr>
					<tr>
						<th>pmafia</th>
						<td>arc.pmafia [optional setup name]</td>
						<td>Creates a new private mafia game.</td>
					</tr>
					<tr>
						<th>leave</th>
						<td>arc.leave</td>
						<td>Leaves your current game.</td>
					</tr>
					<tr>
						<th>invite</th>
						<td>arc.invite</td>
						<td>Displays the invite link to the official EpicMafia server.</td>
					</tr>
					<tr>
						<th>ref</th>
						<td>arc.ref &lt;code&gt;</td>
						<td>(Server owner only) Uses a referral code to give you and the referrer access to <span class="rainbow">text colors</span> if your server has at least 50 members.</td>
					</tr>
					<tr>
						<th>getref</th>
						<td>arc.getref</td>
						<td>Get your referral code to give to server owners. You both gain access to <span class="rainbow">text colors</span> when they invite the bot to their 50+ member server.</td>
					</tr>
					<tr>
						<th><span class="rainbow">colors</span></th>
						<td>arc.colors &lt;"name" or "speech"&gt; &lt;color&gt;</td>
						<td>Set in-game <span class="rainbow">text colors</span>.</td>
					</tr>
					<tr>
						<th>avatar</th>
						<td>arc.avatar &lt;imgur url&gt;</td>
						<td>Set your in-game avatar to an imgur image.</td>
					</tr>
					<tr>
						<th>resetavi</th>
						<td>arc.resetavi</td>
						<td>Reset your in-game avatar to your Discord avatar.</td>
					</tr>
					<tr>
						<th>delete</th>
						<td>arc.delete</td>
						<td>Irreversibly deletes your EpicMafia account info.</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}