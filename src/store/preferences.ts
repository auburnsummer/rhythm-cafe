import type { ExtractAtomValue, SetStateAction } from 'jotai/vanilla';
import { useAtom } from 'jotai/react';
import { persistAtom } from './customAtoms';

const makePreferenceAtom = <T>(name: string, initialValue: T, version: number) => {
    return persistAtom<T>(initialValue, `preference: ${name}`, version, JSON.stringify, JSON.parse);
};

const preferences = {
    'show advanced filters': makePreferenceAtom('show advanced filters', false, 1),
    'show more level details': makePreferenceAtom('show more level details', false, 1),
    'levels per page': makePreferenceAtom('levels per page', 25, 1),
    'row view': makePreferenceAtom('row view', false, 1),
    'search as you type': makePreferenceAtom('search as you type', false, 1),
    'exact search': makePreferenceAtom('exact search', false, 1),
    'force codex urls': makePreferenceAtom('force codex urls', false, 1)
} as const;

type Preferences = typeof preferences;

export const usePreference = <T extends keyof Preferences>(key: T) => {
    type V = ExtractAtomValue<Preferences[T]>
    const a = preferences[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useAtom(a as any) as [V, (update: SetStateAction<V>) => void];
}; 