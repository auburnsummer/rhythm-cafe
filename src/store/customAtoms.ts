import produce from 'immer';
import type { WritableDraft } from 'immer/dist/types/types-external';
import type { WritableAtom } from 'jotai';
import { atom } from 'jotai';

export type ImmerAtom<T> = ReturnType<typeof immerAtom<T>>;

export const immerAtom = <T>(base: WritableAtom<T, T, void>) => {
    const wrapper = atom(
        (get) => get(base),
        (get, set, by: (draft: WritableDraft<T>) => void) => {
            const a = get(base);
            const b = produce(a, by);
            set(base, b);
        }
    );
    return wrapper;
};

type Persisted = {
    version: number;
    value: string;
};

export const persistAtom = <T>(
    initialValue: T,
    key: string,
    version: number,
    serialize: (t: T) => string,
    deserialize: (s: string) => T
) => {
    const atomInitialValue = (() => {
        const storedValue = localStorage.getItem(key);
        if (storedValue != null) {
            try {
                const parsedValue : Persisted = JSON.parse(storedValue);
                if (parsedValue.version >= version) {
                    return deserialize(parsedValue.value);
                }
            }
            catch (SyntaxError) {
                return initialValue;
            }
        }
        return initialValue;
    })();
    const innerAtom = atom(
        atomInitialValue,
        (_get, set, by: T) => {
            const value = serialize(by);
            localStorage.setItem(key, JSON.stringify({ version, value }));
            set(innerAtom, by);
        }
    );
    return innerAtom;
}; 