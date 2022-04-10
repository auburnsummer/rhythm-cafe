import "preact/debug";
import { render } from 'preact'
import { App } from './App'

import "the-new-css-reset/css/reset.css"
import "@orchard/base.css"

render(<App />, document.getElementById('orchard')!)
