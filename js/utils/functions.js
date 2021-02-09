/*
don't panic! 

most of these are lodash functions (https://lodash.com/)
*/
export const constant = x => () => x;
export const cond = list => (...a) => list.find(t => t[0](...a))[1](...a);
export const eq = a => b => a === b;
export const T = constant(true);
export const F = constant(false);
export const range = lim => Array.from(Array(lim).keys());

export const nth = i => arr => arr[i];
export const zip = (...lists) => range(lists[0].length).map(i => lists.map(nth(i)));

export const assign = (obj, [k, v]) => ({...obj, [k]: v});
export const fromPairs = (pairs) => pairs.reduce(assign, {});