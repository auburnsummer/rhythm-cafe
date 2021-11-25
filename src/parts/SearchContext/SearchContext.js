import { createContext } from "preact";

/** @typedef {import("../../hooks/useLevels").Level} Level */

/**
 * @typedef SearchParameter
 * @property {keyof Level} param
 * @property {
     "exact" | 
     "not"   |
     "contains" |
     "endswith" |
     "startswith" |
     "gt" |
     "gte" |
     "lt" |
     "lte" |
     "like" |
     "notlike" |
     "glob" |
     "in" |
     "notin" |
     "arraycontains" |
     "arraynotcontains" |
     "date" |
     "isnull" |
     "notnull" |
     "isblank" |
     "notblank"
    } [type]
 * @property {string | number} [value]
 */

/**
 * @typedef SearchContext
 * @property {SearchParameter[]} params
 * @property {string} q
 */

/**
 * @typedef {StateUpdater<string>} a
 */

/** @type {[SearchContext, import("preact/hooks").StateUpdater<SearchContext>]} */
const contextValue = null;

export const SearchContext = createContext(contextValue);