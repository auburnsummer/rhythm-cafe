import cc from "clsx";

import "./DifficultyDecorator.css";

/**
 * @typedef {import("../../hooks/useLevels").Level} Level
 */

const DIFFICULTY_STRINGS = [
    "Easy",
    "Medium",
    "Tough",
    "Very Tough"
]

const DIFFICULTY_CLASSES = [
    "easy!dd",
    "medium!dd",
    "tough!dd",
    "souls!dd"
]

/**
 * @param {Pick<Level, "difficulty"> & {class?: string}} props
 */
export function DifficultyDecorator({difficulty, "class": _class}) {
    const difficultyString = DIFFICULTY_STRINGS[difficulty];
    const difficultyClass = DIFFICULTY_CLASSES[difficulty];

    return (
        <div class={cc(_class, "dd", difficultyClass)}>
            <span role="presentation" class="dd_triangle"></span>
            <span class="dd_text">{difficultyString}</span>
        </div>
    )
}