import { useState, useCallback } from "preact/hooks";
import { useLog } from "../../hooks/useLog";
import { PreferenceContext } from "./PreferenceContext";



export function PreferenceContextFactory({children}) {

    const defaultValues = {
        "levelsPerPage": 25,
        "showAdvancedFilters": false
    }

    const [prefs, setPrefs] = useState(() => {
        return Object.keys(defaultValues)
            .reduce((prev, curr) => {
                let v;
                try {
                    v = JSON.parse(window.localStorage.getItem(curr));
                } catch {
                    v = null;
                }
                return v !== null
                    ? {
                        ...prev,
                        [curr]: v
                    }
                    : prev;
            }, {});
    });

    useLog(prefs);

    const getPref = useCallback(
        key =>
            Object.keys(prefs).includes(key)
                ? prefs[key]
                : defaultValues[key],
        [prefs, defaultValues]
    );

    const setPref = (key, value) => {
        setPrefs(prev => ({...prev, [key]: value}));
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    return (
        <PreferenceContext.Provider value={[getPref, setPref]}>
            {children}
        </PreferenceContext.Provider>
    )
}