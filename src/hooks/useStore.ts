import { Level } from '@orchard/types';
import create from 'zustand';
import produce, {enableMapSet} from "immer";
import { WritableDraft } from 'immer/dist/types/types-external';

enableMapSet();

type Filter = {
    type: 'in',
    values: Set<string | number>
};

export type OrchardState = {
    q: string;
    setQuery: (to: string) => void;
    facetBy: string[];
    filters: {
        [s: string]: Filter | undefined;
    }
    setFilter: (cat: string, d: (d: WritableDraft<Filter>) => void) => void;
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
            difficulty: {type: 'in', values: new Set([])},
            authors: {type: 'in', values: new Set([])},
            tags: {type: 'in', values: new Set([])},
            artist: {type: 'in', values: new Set([])}
        },
        setFilter: (cat: string, func: (d: WritableDraft<Filter>) => void) => set(draft => {
            const toChange = draft.filters[cat];
            if (toChange) {
                func(toChange);
            }
        })
    };
});