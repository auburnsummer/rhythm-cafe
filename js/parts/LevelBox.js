import { html } from "../utils/html.js";

export function LevelBox({level}) {
	return html`
		<div>
			<h1>${level.song}</h1>
			<h2>${level.author}</h2>
		</div>
	`
}