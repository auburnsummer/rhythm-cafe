import { html } from "./utils/html.js";
import { Levels } from "./parts/Levels.js";
import { Header } from "./parts/Header.js";

export function App({worker}) {

	return html`
		<${Header} />
		<${Levels} worker=${worker} />
	`
}