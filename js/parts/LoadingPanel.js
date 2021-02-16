// The panel that shows the loading status.

import { html } from "../utils/html.js";
import { LSState } from "../utils/enums.js";
import cn from "https://cdn.skypack.dev/classnames";

const stateTexts = {
	[LSState.LoadingWorker]: "Loading worker...",
	[LSState.SyncingDatabase]: "Syncing database...",
	[LSState.DecompressingDatabase]: "Decompressing database...",
	[LSState.InitialisingSqlJs]: "Initialising sql.js..."
}

export function LoadingPanel({state, _class}) {
	return html`
		<div class=${cn("lp", _class)}>
			<h1 class="lp_title">Loading...</h1>	
			<p class="lp_description">${stateTexts[state]}</p>
		</div>
	`
}