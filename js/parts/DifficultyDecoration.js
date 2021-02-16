/**
 * A difficulty decoration. Intended for the top corner of the levelbox typically
 */

import cn from "https://cdn.skypack.dev/classnames";
import { html } from "../utils/html.js";

const DIFFICULTIES = ["Easy", "Medium", "Tough", "Very Tough"];

const DIFFICULTY_CLASSES = [
    "easy!dd",
    "medium!dd",
    "tough!dd",
    "very-tough!dd"
];

export function DifficultyDecoration ({difficulty, _class}) {

    const difficultyText = DIFFICULTIES[difficulty];

    const colour = DIFFICULTY_CLASSES[difficulty];

    return html`
        <div class=${cn("dd", _class, colour)}>
            <span class="dd_bg"></span>
            <span class="dd_text">${difficultyText}</span>
        </div>
    `
}