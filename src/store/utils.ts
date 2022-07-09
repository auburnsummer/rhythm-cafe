import produce from "immer";
import { WritableDraft } from "immer/dist/types/types-external";
import { Atom, atom, WritableAtom } from "jotai";

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
    let shouldUseStoredValue = false;
    const storedValue = localStorage.getItem(key);
    if (storedValue != null) {
        const parsedValue: Persisted = JSON.parse(storedValue);
        if (parsedValue.version >= version) {
            shouldUseStoredValue = true;
        }
    }
    const innerAtom = atom(
        shouldUseStoredValue && storedValue != null ? deserialize(storedValue) : initialValue,
        (_get, set, by: T) => {
            const value = serialize(by);
            localStorage.setItem(key, JSON.stringify({version, value}))
            set(innerAtom, by);
        }
    )
    return innerAtom;
}