import { html } from "./utils/html.js";
import { LSState } from "./utils/enums.js";
import { useSqlWorker } from "./hooks/useSqlWorker.js";

import { LoadingPanel } from "./parts/LoadingPanel.js";
import { App } from "./App.js";

export function LoadingScreen() {

	const {worker, workerState, dbDownloadProgress, workerError} = useSqlWorker();

	if (workerState === LSState.Loaded) {
		return html`
			<${App} worker=${worker} />
		`
	}

	return html`
		<div class="loading-screen">
			<${LoadingPanel} state=${workerState} error=${workerError} />
		</div>
	`
}