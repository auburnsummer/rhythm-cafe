// random library of helper functions.

import { h } from "preact";
import { StateUpdater } from "preact/hooks";

/*
Given an array, return a new array that only contains unique values as determined
by the provided function. i.e. in the new array, there will never be any elements
A and B where func(A) === func(B)
*/
export const uniqBy = <T, A>(func: (a: T) => A, arr: Array<T>) => arr
    .filter(
        (v, i) => !(arr.slice(0, i))
            .some(v2 => func(v) === func(v2)),
    );

/*
Split an array into sub-lists based on the results of a function. The output
is an object mapping the output value of the function to the sub-list of items that
matched that output.
*/
type StringMap<T> = {
    [key: string] : T
}

export const groupBy = <T>(func: (a: T) => string, arr: Array<T>) => arr.reduce((accum: StringMap<Array<T>>, curr) => {
    const bucket = func(curr);
    return {
        ...accum,
        [bucket]: accum[bucket] ? accum[bucket].concat([curr]) : [curr],
    };
}, {});

/*
Given two objects A and B, return a new object containing only the keys in A that are
not duplicated in B.
*/
export const diff = (a: StringMap<any>, b: StringMap<any>) => Object.keys(a)
    .filter(key => a[key] !== b[key])
    .reduce((prev: StringMap<any>, curr) => ({
        [curr]: a[curr],
        ...prev,
    }), {});

/*
Remove a "slice" in a string, replacing it with the given string.
*/
export const removeSlice = (a: string, i: number, j: number, s = "") => a.slice(0, i) + s + a.slice(j)

// identity function.
export const id = <T>(a: T) => a;

/*
wrapper for the typical setSomething(evt.target.value) pattern. pass a transformer as needed.
*/
export const setThis = <T>(setFunc: StateUpdater<T>, transform: (_: string) => T) => (evt: Event) => {
    const {target} = evt;
    if (target) {
        setFunc(transform((<HTMLInputElement>target).value));
    }
}
