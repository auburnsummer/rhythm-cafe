/**
 * A difficulty decoration. Intended for the top corner of the levelbox typically
 */

import cn from "https://cdn.skypack.dev/classnames";
import { html } from "../utils/html.js";

const DIFFICULTIES = ["Easy", "Medium", "Tough", "Very Tough"];

const DIFFICULTY_CLASSES = [
    "easy!difficulty-decoration",
    "medium!difficulty-decoration",
    "tough!difficulty-decoration",
    "very-tough!difficulty-decoration"
];

export function DifficultyDecoration ({difficulty, _class}) {

    console.log("====");
    console.log(difficulty);
    console.log(DIFFICULTIES);

    const difficultyText = DIFFICULTIES[difficulty];

    const colour = DIFFICULTY_CLASSES[difficulty];

    return html`
        <div class=${cn("difficulty-decoration", _class, colour)}>
            <span class="difficulty-decoration_bg"></span>
            <span class="difficulty-decoration_text">${difficultyText}</span>
        </div>
    `
}