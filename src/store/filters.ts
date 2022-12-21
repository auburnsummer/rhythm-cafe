import { atom } from 'jotai/vanilla';
import { useAtom } from 'jotai/react';
import { is, isBoolean, isNumber, isOfShape } from 'type-guards';
import { persistAtom } from './customAtoms';
import { atomWithImmer, withImmer } from 'jotai-immer';
import { pageAtom } from './queryAndPage';

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

export type ImmerAtom<T> = ReturnType<typeof atomWithImmer<T>>;

// when a filter is set, the page is reset to 1. this is common behaviour across all filters.
const filterAtom = <T>(initialValue: T) => {
    const innerAtom = atom(
        initialValue,
        (_get, set, by: T) => {
            set(innerAtom, by);
            set(pageAtom, 1);
        }
    );
    return withImmer(innerAtom);
}

export const difficultyFilterAtom = filterAtom<SetFilter>({
    name: 'difficulty',
    type: 'set',
    op: 'or',
    active: true,
    values: new Set<number>([])
});

export const authorsFilterAtom = filterAtom<SetFilter>({
    name: 'authors',
    type: 'set',
    op: 'and',
    active: true,
    values: new Set<string>([])
});

export const tagsFilterAtom = filterAtom<SetFilter>({
    name: 'tags',
    type: 'set',
    op: 'and',
    active: true,
    values: new Set<string>([])
});

export const artistFilterAtom = filterAtom<SetFilter>({
    name: 'artist',
    type: 'set',
    op: 'or',
    active: true,
    values: new Set<string>([])
});

export const bpmFilterAtom = filterAtom<RangeFilter>({
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
export const approvalFilterAtom = withImmer(persistAtom<RangeFilter>(
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
));

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