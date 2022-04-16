import { VoidFunc } from "@orchard/utils/types";
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
export type Filter = FacetFilter | RangeFilter;


export type FilterMap = {
    difficulty: FacetFilter,
    authors: FacetFilter,
    tags: FacetFilter,
    artist: FacetFilter,
    bpm: RangeFilter,
    approval: RangeFilter
};

export type FilterKey = keyof FilterMap;

export type PreferenceKey = "show advanced filters" | "show more level details" | "levels per page"

export type Preferences = {
    [k in PreferenceKey]: string;
};

export type OrchardState = {
    q: string;
    setQuery: (to: string) => void;
    facetBy: string[];
    filters: FilterMap;
    setFilter: <T extends FilterKey>(cat: T, d: VoidFunc<WritableDraft<FilterMap>[T]>) => void;
    preferences: Preferences;
    setPreference: (pref: PreferenceKey, value: string) => void;
}