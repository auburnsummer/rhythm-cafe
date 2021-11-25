import cc from "clsx";

import "./SearchToken.css";

/**
 * @typedef SearchTokenProps
 * @property {string?} class
 */

/** @param {SearchTokenProps} */
export function SearchToken({"class": _class}) {
    return (
        <div class={cc(_class, "st")}>
            ayayaaa
        </div>
    )
}