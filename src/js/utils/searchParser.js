/* parse the search bar syntax into an object */

import { removeSlice } from "./helpers";

function tagFilter(prev) {
    const re = /\[(.+?)\]/;
    const match = prev.search.match(re);
    if (match === null) {
        // we're done.
        return prev;
    }
    // there was a match.
    const newTags = prev.tags.concat([match[1]]);
    const newQ = removeSlice(prev.search, match.index, match.index + match[0].length, "");
    return tagFilter({
        ...prev,
        tags: newTags,
        search: newQ,
    })
}

export function searchParser(q) {
    return tagFilter({
        tags: [],
        authors: [],
        search: q,
    });
}
