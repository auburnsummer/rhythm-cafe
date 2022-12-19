import { atom, useAtom } from 'jotai';
import { is, isBoolean, isNumber, isOfShape } from 'type-guards';
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

export type ApprovalFilter = RangeFilter & {
    name: "approval";
}

// immerAtom takes an atom as an argument, and creates a new atom that wraps that with immer.
// we have two factory methods to produce these.


// create an atom with immer that does not persist its value.
const notPersistedFilterAtom = <T>(t: T): ImmerAtom<T> => immerAtom<T>(atom<T>(t));  // t is my favourite letter
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

const isApprovalFilter = (a: unknown): ApprovalFilter | undefined => {
    const guard = isOfShape({
        "name": is("approval" as const),
        "type": is("range" as const),
        "active": isBoolean,
        "min": isNumber,
        "max": isNumber
    });
    if (guard(a)) {
        if (a.max >= a.min) {
            return a
        }
    }
    return undefined
}

const defaultApproval = {
    name: 'approval' as const,
    type: 'range' as const,
    active: true,
    min: 10,
    max: 20
};
export const approvalFilterAtom = persistedFilterAtom<RangeFilter>(
    defaultApproval,
    'approval_filter',
    2,
    JSON.stringify,
    (s) => {
        try {
            let a: unknown = JSON.parse(s);
            return isApprovalFilter(a) || defaultApproval
        } catch (SyntaxError) {
            return defaultApproval
        }
    }
);

export const useDifficultyFilter = () => useAtom(difficultyFilterAtom);
export const useAuthorsFilter = () => useAtom(authorsFilterAtom);
export const useTagsFilter = () => useAtom(tagsFilterAtom);
export const useArtistFilter = () => useAtom(artistFilterAtom);
export const useBPMFilter = () => useAtom(bpmFilterAtom);
export const useApprovalFilter = () => useAtom(approvalFilterAtom);

export const allFilters = atom(
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
    return useAtom(allFilters);
};