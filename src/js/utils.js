// Disorganised pile of utilities
import Enum from 'enum';

export const API_URL = "https://api.rhythm.cafe/orchard.json";

export const LoadingState = new Enum(["Loading", "Loaded", "Error"]);

export const SortOptions = new Enum([
	"Newest",
	"Oldest",
	"ArtistAToZ",
	"ArtistZToA",
	"SongAToZ",
	"SongZToA"
])

// Ramda uniqBy
export const uniqBy = (func, arr) => arr.filter((v, i) => !(arr.slice(0, i)).some(v2 => func(v) === func(v2)));

// Ramda groupBy
export const groupBy = (func, arr) => arr.reduce((accum, curr) => {
    const bucket = func(curr);
    return {
        ...accum,
        [bucket]: accum[bucket] ? accum[bucket].concat([curr]) : [curr]
    }
}, {});