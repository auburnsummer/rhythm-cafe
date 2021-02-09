import { html } from "./utils/html.js";
import Router from 'https://cdn.skypack.dev/preact-router';
import { createHashHistory } from 'https://cdn.skypack.dev/history';
import { Levels } from "./parts/Levels.js";

export function App({worker}) {
	return html`
		<${Router} history=${createHashHistory()}>
			<${Levels} worker=${worker} path="/" />
		</${Router}>
	`
}