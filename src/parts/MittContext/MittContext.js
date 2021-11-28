import mitt from 'mitt';
import { createContext } from 'preact';

/** @type import('mitt').Emitter<string> */
const contextValue = null;

export const MittContext = createContext(contextValue)