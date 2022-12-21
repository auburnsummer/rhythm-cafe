import { atom } from 'jotai/vanilla';
import { isNumber, isOfShape, isString } from 'type-guards';

type Persisted = {
    version: number;
    value: string;
};

const isPersisted = isOfShape<Persisted>({
    "version": isNumber,
    "value": isString
})

function getAtomInitialValue<T>(initialValue: T, key: string, version: number, deserialize: (s: string) => T) {
    const storedValue = localStorage.getItem(key);
    if (storedValue == null) {
        return initialValue;
    }
    try {
        const parsedValue : unknown = JSON.parse(storedValue);
        if (isPersisted(parsedValue)) {
            if (parsedValue.version >= version) {
                return deserialize(parsedValue.value);
            }
        }
        return initialValue;
    }
    catch (SyntaxError) {
        return initialValue;
    }
}

/**
 * An atom that persists its value in localStorage
 * @param initialValue 
 * @param key - localStorage key for this atom. must be unique
 * @param version - if the version in localStorage is less than this, stored value is ignored.
 * @param serialize - function to serialize to a string
 * @param deserialize - function to deserialize back
 * @returns 
 */
export const persistAtom = <T>(
    initialValue: T,
    key: string,
    version: number,
    serialize: (t: T) => string,
    deserialize: (s: string) => T
) => {
    const innerAtom = atom(
        getAtomInitialValue(initialValue, key, version, deserialize),
        (_get, set, by: T) => {
            const value = serialize(by);
            localStorage.setItem(key, JSON.stringify({ version, value }));
            set(innerAtom, by);
        }
    );
    return innerAtom;
}; 