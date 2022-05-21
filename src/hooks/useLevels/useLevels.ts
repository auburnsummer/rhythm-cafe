import {
    Level,
    SearchParams,
    SearchResponse
} from '@orchard/hooks/useLevels/types';
import { TYPESENSE_API_KEY, TYPESENSE_URL } from '@orchard/utils/constants';
import Axios, { Response } from 'redaxios';
import useSWR from 'swr';
import usePrevious from '@orchard/hooks/usePrevious';
import {
    As,
    useFilter,
    usePage,
    usePreference,
    useStore
} from '@orchard/store';
import { getKeys } from '@orchard/utils/grabbag';

function useFilterByString() {
    const filters = useStore((state) => state.filters);
    return getKeys(filters)
        .reduce((prev, key) => {
            const filter = filters[key];
            if (!filter) {
                return prev;
            }
            if (!filter.active) {
                return prev;
            }
            if (filter.type === 'in' && filter.values.size > 0) {
                const next = `${key}:=[${Array.from(filter.values).join(',')}]`;
                return [...prev, next];
            }
            if (filter.type === 'all' && filter.values.size > 0) {
                const nexts = Array.from(filter.values).map(
                    (v) => `${key}:=${v}`
                );
                return [...prev, ...nexts];
            }
            // special handling of bpm...
            if (filter.type === 'range' && key === 'bpm') {
                const { min, max } = filter;
                // both the min_bpm and the max_bpm need to be within specified range.
                // mostly because the "or" version requires typesense to do funky stuff i'm not sure yet...
                const nexts = [
                    `max_bpm:=[${min}..${max}]`,
                    `min_bpm:=[${min}..${max}]`
                ];
                return [...prev, ...nexts];
            }
            // other range filters.
            if (filter.type === 'range') {
                const { min, max } = filter;
                const next = `${key}:=[${min}..${max}]`;
                return [...prev, next];
            }
            return prev;
        }, [] as string[])
        .join(' && ');
}

type useLevelsProps = {
    facetQuery?: string;
    maxFacetValues?: number;
};

export function useLevels({ facetQuery, maxFacetValues }: useLevelsProps = {}) {
    const q = useStore((state) => state.q);
    const facetBy = useStore((state) => state.facetBy);
    const [page] = usePage();
    const filterByString = useFilterByString();

    const [numberOfLevels] = usePreference('levels per page', As.NUMBER);
    const [useCfCache] = usePreference('use cf cache', As.BOOLEAN);
    const [exactSearch] = usePreference('exact search', As.BOOLEAN);

    const [prFilter] = useFilter('approval');

    const showingNonPRLevels = prFilter.min <= -1;

    const processed: SearchParams = {
        q: q.trim(),
        query_by: 'song, authors, artist, tags, description',
        query_by_weights: '12, 8, 6, 5, 4',
        facet_by: facetBy.join(','),
        per_page: numberOfLevels,
        max_facet_values: maxFacetValues || 10,
        filter_by: filterByString,
        page: page,
        // todo: when typesense 0.23 comes out, implement configurable sort
        // note: not PR'ed levels do not have the `indexed` property set. so if non pr'd levels are allowed,
        // only sort by last_updated directly.
        sort_by: showingNonPRLevels
            ? '_text_match:desc,last_updated:desc'
            : '_text_match:desc,indexed:desc,last_updated:desc',
        num_typos: exactSearch ? '0, 0, 0, 0, 0' : '2, 1, 1, 1, 0'
    };
    if (facetQuery) {
        processed.facet_query = facetQuery;
    }

    const { data, error } = useSWR<
        Response<SearchResponse<Level>>,
        Response<unknown>
    >(processed, (params: SearchParams) => {
        if (!useCfCache) {
            // set it in here to avoid SWR cache miss.
            params.__fake_value_for_cache = `${Date.now()}`;
        }
        return Axios({
            url: `${TYPESENSE_URL}/collections/levels/documents/search`,
            headers: {
                'x-typesense-api-key': TYPESENSE_API_KEY
            },
            params
        });
    });

    const [previousData, resetPreviousData] = usePrevious(data);
    const dataOrPrevious = data === undefined ? previousData : data;
    const isLagging = data === undefined && previousData !== undefined;

    return { data: dataOrPrevious, error, isLagging, resetPreviousData };
}
