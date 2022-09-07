import { atom, useAtom } from 'jotai';
import type { ImmerAtom } from './customAtoms';
import { immerAtom, persistAtom } from './customAtoms';

type FilterType = 
    'set' |   // the value is in a set.
    'range';  // the value is in the specified numerical range.

export type BaseFilter = {
    name: string;
    type: FilterType;
    active: boolean;
};

export type SetFilter = BaseFilter & {
    type: 'set';
    op: 'and' | 'or';  // and: all the values must be in the set. or: only one value has to be in the set.
    values: Set<string | number>;
};

export type RangeFilter = BaseFilter & {
    type: 'range';
    min: number;
    max: number;
};

// immerAtom takes an atom as an argument, and creates a new atom that wraps that with immer.
// we have two factory methods to produce these.


// create an atom with immer that does not persist its value.
const notPersistedFilterAtom = <T>(t: T): ImmerAtom<T> => immerAtom<T>(atom<T>(t));
// create an atom with immer that persists its value. arguments are from "persistAtom"
type PersistAtom<T> = typeof persistAtom<T>;
const persistedFilterAtom = <T>(...a: Parameters<PersistAtom<T>>): ImmerAtom<T> => immerAtom<T>(persistAtom<T>(...a));

export const difficultyFilterAtom = notPersistedFilterAtom<SetFilter>({
    name: 'difficulty',
    type: 'set',
    op: 'or',
    active: true,
    values: new Set<number>([])
});

export const authorsFilterAtom = notPersistedFilterAtom<SetFilter>({
    name: 'authors',
    type: 'set',
    op: 'and',
    active: true,
    values: new Set<string>([])
});

export const tagsFilterAtom = notPersistedFilterAtom<SetFilter>({
    name: 'tags',
    type: 'set',
    op: 'and',
    active: true,
    values: new Set<string>([])
});

export const artistFilterAtom = notPersistedFilterAtom<SetFilter>({
    name: 'artist',
    type: 'set',
    op: 'or',
    active: true,
    values: new Set<string>([])
});

export const bpmFilterAtom = notPersistedFilterAtom<RangeFilter>({
    name: 'bpm',
    type: 'range',
    active: false,
    min: 0,
    max: 0
});

export const approvalFilterAtom = persistedFilterAtom<RangeFilter>(
    {
        name: 'approval',
        type: 'range',
        active: true,
        min: 10,
        max: 20
    },
    'approval_filter',
    1,
    JSON.stringify,
    JSON.parse
);

export const useDifficultyFilter = () => useAtom(difficultyFilterAtom);
export const useAuthorsFilter = () => useAtom(authorsFilterAtom);
export const useTagsFilter = () => useAtom(tagsFilterAtom);
export const useArtistFilter = () => useAtom(artistFilterAtom);
export const useBPMFilter = () => useAtom(bpmFilterAtom);
export const useApprovalFilter = () => useAtom(approvalFilterAtom);

const allOfThem = atom(
    (get) => [
        get(difficultyFilterAtom),
        get(authorsFilterAtom),
        get(tagsFilterAtom),
        get(artistFilterAtom),
        get(bpmFilterAtom),
        get(approvalFilterAtom)
    ] as const
);

export const useFilters = () => {
    return useAtom(allOfThem);
};