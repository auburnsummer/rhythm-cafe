import { h } from 'https://cdn.skypack.dev/preact';
import htm from "https://cdn.skypack.dev/htm";

// create a Preact version of HTM once.
export const html = htm.bind(h);