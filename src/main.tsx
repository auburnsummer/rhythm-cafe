import 'preact/debug';
import { render } from 'preact';
import { App } from './App';

import 'the-new-css-reset/css/reset.css';
import '@orchard/base.css';

const orchard = document.getElementById('orchard');
if (orchard) {
    render(<App />, orchard);
}

