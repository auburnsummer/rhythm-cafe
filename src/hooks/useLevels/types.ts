export type SearchParams = {
    q: string;
    query_by?: string;
    query_by_weights?: string;
    prefix?: string | boolean;
    filter_by?: string;
    sort_by?: string;
    facet_by?: string;
    max_facet_values?: number;
    facet_query?: string;
    page?: number;
    per_page?: number;
    group_by?: string;
    group_limit?: number;
    include_fields?: string;
    exclude_fields?: string;
    highlight_fields?: string;
    highlight_full_fields?: string;
    highlight_affix_num_tokens?: number;
    highlight_start_tag?: string;
    highlight_end_tag?: string;
    snippet_threshold?: number;
    num_typos?: string | number;
    min_len_1typo?: number;
    min_len_2typo?: number;
    exhaustive_search?: boolean;
    drop_tokens_threshold?: number;
    typo_tokens_threshold?: number;
    pinned_hits?: string;
    hidden_hits?: string;
    limit_hits?: number;
    pre_segmented_query?: boolean;
    enable_overrides?: boolean;
    prioritize_exact_match?: boolean;
    search_cutoff_ms?: number;
    use_cache?: boolean;
}

export type Level = {
    id: string;
    artist: string;
    song: string;
    difficulty: 0 | 1 | 2 | 3;
    seizure_warning: boolean;
    description: string;
    max_bpm: number;
    min_bpm: number;
    last_updated: number;
    single_player: boolean;
    two_player: boolean;
    authors: string[];
    tags: string[];
    thumb: string;
    url?: string;
    url2: string;
    icon?: string;
    hue: number;
    has_classics: boolean;
    has_oneshots: boolean;
    has_squareshots: boolean;
    has_swing: boolean;
    has_freetimes: boolean;
    has_holds: boolean;
    source: string;
    source_iid: string;
    uploaded: number;
    approval: number;
    kudos: number;
}

export type SearchResponseFacetCountSchema<T> = {
    counts: [
        {
            count: number;
            highlighted: string;
            value: string;
        }
    ];
    field_name: keyof T;
    stats: {
        avg?: number;
        max?: number;
        min?: number;
        sum?: number;
        total_values?: number;
    };
}

export interface SearchResponseHit<T> {
    highlights?: [
        {
            field: keyof T;
            snippet?: string;
            value?: string;
            snippets?: string[];
            indices?: string[];
            matched_tokens: string[];
        }
    ];
    document: T;
    text_match: number;
}

export type SearchResponse<T> = {
    facet_counts?: SearchResponseFacetCountSchema<T>[];
    found: number;
    out_of: number;
    page: number;
    request_params: SearchParams;
    search_time_ms: number;
    hits?: SearchResponseHit<T>[];
    grouped_hits?: {
        group_key: string[];
        hits: SearchResponseHit<T>[];
    }[];
}