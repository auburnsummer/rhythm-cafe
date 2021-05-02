/* parse the search bar syntax into an object */

import { removeSlice } from "./helpers";

type ParsedSearcher = {
    tags: Array<string>
    authors: Array<string>
    search: string
}

function tagFilter(prev: ParsedSearcher): ParsedSearcher {
    const re = /\[(.+?)\]/;
    const match = prev.search.match(re);

    if (match && match.index) {
        // there was a match.
        const newTags = prev.tags.concat([match[1]]);
        const newQ = removeSlice(prev.search, match.index, match.index + match[0].length, "");
        return tagFilter({
            ...prev,
            tags: newTags,
            search: newQ,
        })
    }

    return prev;
}

export function searchParser(q: string) {
    return tagFilter({
        tags: [],
        authors: [],
        search: q,
    });
}
