
/**
 * @param {number} min
 * @param {number} max
 * @returns a random integer between `min` (inclusive) and `max` (exclusive)
 */
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
} 

/**
 * @template T
 * @param {T[]} arr 
 * @returns A randomly selected item from `arr`
 */
export function sample(arr) {
    return arr[randInt(0, arr.length)];
}

/**
 * @param {number} n 
 * @returns An array of numbers from 0 to n exclusive
 */
export function range(n) {
    return Array.from(Array(n).keys());
}