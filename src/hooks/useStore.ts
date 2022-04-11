import { Level } from '@orchard/types';
import create from 'zustand'

type Filter = {
    type: 'in',
    values: (string | number)[]
};

export type OrchardState = {
    q: string;
    setQuery: (to: string) => void;
    facetBy: string[];
    filters: {
        [s: string]: Filter | undefined;
    }
    setFilter: (cat: string, to: Filter) => void;
}

export const useStore = create<OrchardState>(set => ({
    q: "",
    setQuery: (s: string) => set({q: s}),
    facetBy: ["authors", "tags", "source", "difficulty"],
    filters: {
        difficulty: {type: 'in', values: [0, 2]},
        authors: {type: 'in', values: ['auburnsummer']}
    },
    setFilter: (cat: string, to: Filter) => set(state => {
        return {
            ...state,
            filters: {
                ...state.filters,
                [cat]: to
            }
        }
    })
}));