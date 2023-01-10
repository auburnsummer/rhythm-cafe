import { SearchParams } from "@orchard/hooks/useLevels/types";
import { useAtom, useAtomValue } from "jotai/react";
import { atom } from "jotai/vanilla";
import { filterByStringAtom } from "./filterByString";
import { approvalFilterAtom } from "./filters";
import { preferences } from "./preferences";
import { pageAtom, queryAtom } from "./queryAndPage";


export const levelsSearchParamsAtom = atom(get => {
    const q = get(queryAtom);
    const facetBy = ['authors', 'tags', 'source', 'difficulty', 'artist'] as const;
    const page = get(pageAtom);
    const filterByString = get(filterByStringAtom);
    const numberOfLevels = get(preferences["levels per page"]);
    const prFilter = get(approvalFilterAtom);
    const exactSearch = get(preferences["exact search"]);

    const showingNonPRLevels = prFilter.min <= -1 || !prFilter.active;

    const processed: SearchParams = {
        q: q.trim(),
        query_by: 'song, authors, artist, tags, description',
        query_by_weights: '12, 8, 6, 5, 4',
        facet_by: facetBy.join(','),
        per_page: numberOfLevels,
        filter_by: filterByString,
        page: page,
        // todo: when typesense 0.23 comes out, implement configurable sort
        // note: not PR'ed levels do not have the `indexed` property set. so if non pr'd levels are allowed,
        // only sort by last_updated directly.
        sort_by: showingNonPRLevels
            ? '_text_match:desc,last_updated:desc'
            : '_text_match:desc,indexed:desc,last_updated:desc',
        num_typos: exactSearch
            ? '0, 0, 0, 0, 0'
            : '2, 1, 1, 1, 0'
    };

    return processed;
});

export const useLevelsSearchParams = () => useAtomValue(levelsSearchParamsAtom);