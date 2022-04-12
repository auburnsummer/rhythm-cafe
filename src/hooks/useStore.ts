import create from 'zustand';
import produce, {enableMapSet} from "immer";
import { WritableDraft } from 'immer/dist/types/types-external';

enableMapSet();

type BaseFilter = {
    type: string;
    active: boolean;
}

type InFilter = BaseFilter & {
    type: 'in',
    values: Set<string | number>
};

type AllFilter = BaseFilter & {
    type: 'all',
    values: Set<string | number>
}

export type RangeFilter = BaseFilter & {
    type: 'range',
    min: number,
    max: number
}

export type FacetFilter = InFilter | AllFilter;
type Filter = InFilter | AllFilter | RangeFilter;

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

export const useStore = create<OrchardState>(_set => {
    const set = (func: (draft: WritableDraft<OrchardState>) => void) => {
        _set(state => produce(state, func))
    };
    return {
        q: "",
        setQuery: (s: string) => set(draft => {
            draft.q = s
        }),
        facetBy: ["authors", "tags", "source", "difficulty", "artist"],
        filters: {
            difficulty: {type: 'in', active: true, values: new Set([])},
            authors: {type: 'all', active: true, values: new Set([])},
            tags: {type: 'all', active: true, values: new Set([])},
            artist: {type: 'in', active: true, values: new Set([])},
            bpm: {type: 'range', active: false, min: 0, max: 0}
        },
        setFilter: <T extends keyof OrchardState['filters'],>(cat: T, func: (d: OrchardState['filters'][T]) => void) => set(draft => {
            const toChange = draft.filters[cat];
            if (toChange) {
                func(toChange);
            }
        })
    };
});