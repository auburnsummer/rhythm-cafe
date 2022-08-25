import { Level, SearchParams, SearchResponse } from '@orchard/hooks/useLevels/types';
import { TYPESENSE_API_KEY, TYPESENSE_URL } from '@orchard/utils/constants';
import Axios, { Response } from 'redaxios';
import useSWR from 'swr';
import usePrevious from '@orchard/hooks/usePrevious';
import { useApprovalFilter, useFilters, usePage, usePreference, useQuery } from '@orchard/store';

function useFilterByString() {
    const [filters] = useFilters();
    return filters
        .reduce((prev, filter) => {
            if (!filter) {
                return prev;
            } 
            if (!filter.active) {
                return prev;
            }
            if (filter.type === 'set') {
                if (filter.values.size === 0) {
                    return prev;
                }
                if (filter.op === 'and') {
                    const values = [...filter.values];
                    const nexts = values.map(v => `${filter.name}:=${v}`);
                    return [...prev, ...nexts];    
                }
                if (filter.op === 'or') {
                    const values = [...filter.values];
                    const next = `${filter.name}:=[${values.join(',')}]`;
                    return [...prev, next];
                }
            }
            // special handling of bpm...
            if (filter.type === 'range' && filter.name === 'bpm') {
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
                const { min, max, name } = filter;
                const next = `${name}:=[${min}..${max}]`;
                return [...prev, next];
            }
            return prev;
        }, [] as string[])
        .join(' && ');
}

type useLevelsProps = {
    facetQuery?: string;
    maxFacetValues?: number;
}

export function useLevels({facetQuery, maxFacetValues}: useLevelsProps = {}) {
    const [q] = useQuery();
    const facetBy = ['authors', 'tags', 'source', 'difficulty', 'artist'];
    const [page] = usePage();
    const filterByString = useFilterByString();

    const [numberOfLevels] = usePreference('levels per page');
    const [useCfCache] = usePreference('use cf cache');

    const [prFilter] = useApprovalFilter();
    const [exactSearch] = usePreference('exact search');

    const showingNonPRLevels = prFilter.min <= -1 || !prFilter.active;

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
        num_typos: exactSearch
            ? '0, 0, 0, 0, 0'
            : '2, 1, 1, 1, 0'
    };
    if (facetQuery) {
        processed.facet_query = facetQuery;
    }


    const {data, error} = useSWR<Response<SearchResponse<Level>>, Response<unknown>>(processed, (params: SearchParams) => {
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

 
    return { data: dataOrPrevious, error, isLagging, resetPreviousData};
}