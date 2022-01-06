import { PreferenceContext } from "../parts/PreferenceContext/PreferenceContext";
import { useContext, useMemo } from "preact/hooks";

export function usePreference(key) {
    const [getPref, setPref] = useContext(PreferenceContext);

    const value = useMemo(() => getPref(key), [getPref, key]);
    const set = value => setPref(key, value);

    return [value, set];
}