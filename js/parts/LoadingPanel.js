// The panel that shows the loading status.

import { html } from "../utils/html.js";
import { LSState } from "../utils/enums.js";

const stateTexts = {
	[LSState.LoadingWorker]: "Loading worker...",
	[LSState.SyncingDatabase]: "Syncing database...",
	[LSState.DecompressingDatabase]: "Decompressing database...",
	[LSState.InitialisingSqlJs]: "Initialising sql.js..."
}

export function LoadingPanel({state}) {
	return html`
		<div class="loading-panel">
			<h1>Loading...</h1>	
			<p>${stateTexts[state]}</p>
		</div>
	`
}