import type { Level, SearchParams, SearchResponse } from '@orchard/hooks/useLevels/types';
import { TYPESENSE_API_KEY, TYPESENSE_URL } from '@orchard/utils/constants';
import type { Response } from 'redaxios';
import Axios from 'redaxios';
import useSWR from 'swr';
import { useApprovalFilter, usePage, usePreference, useQuery } from '@orchard/store';
import { useFilterByString } from '@orchard/store/filterByString';

type useLevelsProps = {
    facetQuery?: string;
    maxFacetValues?: number;
}

export function useLevelsSearchParams({ facetQuery, maxFacetValues }: useLevelsProps = {}) {
    const [q] = useQuery();
    const facetBy = ['authors', 'tags', 'source', 'difficulty', 'artist'] as const;
    const [page] = usePage();
    const [filterByString] = useFilterByString();

    const [numberOfLevels] = usePreference('levels per page');

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

    return processed;
}

function fetcher(params: SearchParams) {
    return Axios<SearchResponse<Level>>({
        url: `${TYPESENSE_URL}/collections/levels/documents/search`,
        headers: {
            'x-typesense-api-key': TYPESENSE_API_KEY
        },
        params
    });
}

type SWRReturnType = Response<SearchResponse<Level>>;
type SWRErrorType = Response<unknown>;

export function useLevels({ facetQuery, maxFacetValues }: useLevelsProps = {}) {
    const processed = useLevelsSearchParams({facetQuery, maxFacetValues});

    const { data, error, isLoading } = useSWR<SWRReturnType, SWRErrorType>(processed, fetcher, {
        keepPreviousData: true
    });
 
    return { data, error, isLoading };
}