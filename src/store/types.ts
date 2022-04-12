import { WritableDraft } from "immer/dist/types/types-external";

export type BaseFilter = {
    type: string;
    active: boolean;
}

export type InFilter = BaseFilter & {
    type: 'in',
    values: Set<string | number>
};

export type AllFilter = BaseFilter & {
    type: 'all',
    values: Set<string | number>
}

export type RangeFilter = BaseFilter & {
    type: 'range',
    min: number,
    max: number
}

export type FacetFilter = InFilter | AllFilter;
export type Filter = InFilter | AllFilter | RangeFilter;

export type OrchardState = {
    q: string;
    setQuery: (to: string) => void;
    facetBy: string[];
    filters: {
        difficulty: FacetFilter,
        authors: FacetFilter,
        tags: FacetFilter,
        artist: FacetFilter,
        bpm: RangeFilter
    }
    setFilter: (cat: keyof OrchardState['filters'], d: (d: WritableDraft<Filter>) => void) => void;
}