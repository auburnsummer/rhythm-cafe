export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

export function tuple<T extends unknown[]>(...elements: T) {
    return elements;
}

export function identity<T>(a: T) {
    return a;
}