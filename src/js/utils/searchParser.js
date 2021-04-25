/* parse the search bar syntax into an object */

import { removeSlice } from "./helpers";

function tagFilter(prev) {
    const re = /\[(.+?)\]/;
    const match = prev.query.match(re);
    if (match === null) {
        // we're done.
        return prev;
    } else {
        // there was a match.
        const newTags = prev.tags.concat([match[1]]);
        const newQ = removeSlice(prev.query, match.index, match.index + match[0].length, "");
        return tagFilter({
            ...prev,
            tags: newTags,
            query: newQ
        })
    }
}

export function searchParser(q) {
    return tagFilter({
        tags: [],
        authors: [],
        query: q,
    });
}
