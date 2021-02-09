// The panel that shows the loading status.

import { html } from "../utils/html.js";
import { cond, constant, T, eq } from "../utils/functions.js";
import { LSState } from "../utils/enums.js";

const getStateText = cond([
	[eq(LSState.LoadingWorker), constant("Loading worker...")],
	[eq(LSState.SyncingDatabase), constant("Syncing database...")],
	[eq(LSState.DecompressingDatabase), constant("Decompressing database...")],
	[eq(LSState.InitialisingSqlJs), constant("Initialising sql.js...")],
	[T, constant("huh how are you reading this")]
]);

export function LoadingPanel({state, _class}) {
	return html`
		<div class="loading-panel">
			<h1>Loading...</h1>	
			<p>${getStateText(state)}</p>
		</div>
	`
}