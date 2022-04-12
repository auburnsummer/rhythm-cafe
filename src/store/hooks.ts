import create from 'zustand';
import produce, {enableMapSet} from "immer";
import { WritableDraft } from 'immer/dist/types/types-external';
import { OrchardState, FilterMap } from './types';
import { tuple } from '@orchard/utils/grabbag';
import { curry } from 'lodash-es';

enableMapSet();

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
        setFilter: <T extends keyof FilterMap,>(cat: T, func: (d: FilterMap[T]) => void) => set(draft => {
            const toChange = draft.filters[cat];
            if (toChange) {
                func(toChange);
            }
        })
    };
});

export const useQuery = () => {
    const q = useStore(state => state.q);
    const setQuery = useStore(state => state.setQuery);
    return tuple(q, setQuery);
};

export const useFilter = <T extends keyof FilterMap>(name: T) => {
    const filter = useStore(state => state.filters[name]);
    const _setFilter = useStore(state => state.setFilter);
    const setFilter = curry(_setFilter)(name);
    return tuple(filter, setFilter);
}