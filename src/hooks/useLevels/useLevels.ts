import type { Level, SearchParams, SearchResponse } from '@orchard/hooks/useLevels/types';
import { TYPESENSE_API_KEY, TYPESENSE_URL } from '@orchard/utils/constants';
import type { Response } from 'redaxios';
import Axios from 'redaxios';
import useSWR from 'swr';
import usePrevious from '@orchard/hooks/usePrevious';
import { useApprovalFilter, usePage, usePreference, useQuery } from '@orchard/store';
import { useFilterByString } from '@orchard/store/filterByString';



type useLevelsProps = {
    facetQuery?: string;
    maxFacetValues?: number;
}

export function useLevels({ facetQuery, maxFacetValues }: useLevelsProps = {}) {
    const [q] = useQuery();
    const facetBy = ['authors', 'tags', 'source', 'difficulty', 'artist'];
    const [page] = usePage();
    const [filterByString] = useFilterByString();

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


    const { data, error } = useSWR<Response<SearchResponse<Level>>, Response<unknown>>(processed, (params: SearchParams) => {
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