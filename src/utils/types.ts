import { ClassValue } from "clsx"

export type WithClass = {
    class?: ClassValue
};

export type KeyOfType<T, V> = keyof {
    [P in keyof T as (T[P] extends V? P: never)]: any
};

export type VoidFunc<T> = (arg: T) => void;