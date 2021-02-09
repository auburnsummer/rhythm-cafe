import 'https://cdn.skypack.dev/preact/debug';
import { render } from 'https://cdn.skypack.dev/preact';
import { html } from "./js/utils/html.js";
import { LoadingScreen } from "./js/LoadingScreen.js";

render(html`<${LoadingScreen} />`, document.body);