import cc from "clsx";
import { SearchToken } from "..";

import "./Search.css";

/**
 * @typedef SearchProps
 * @property {string?} class
 */

/** @param {SearchProps} */
export function Search({"class": _class}) {
    return (
        <div class={cc(_class, "se")}>
            {/* <SearchToken class="se_token" /> */}
        </div>
    )
}