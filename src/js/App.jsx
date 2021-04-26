import { h, Fragment } from 'preact';
import { Header } from "./parts/Header";
import { Levels } from "./parts/Levels";

import qs from "querystringify";
import { useEffect, useMemo } from "preact/hooks";
import { useLocation}  from "./hooks/useLocation";

import { diff } from "./utils/helpers";

export function App() {
    // useLocation hook from wouter. modified so that _location also contains the query string.
    const [_location, _setLocation] = useLocation();

    // default values for various query params.
    const defaults = {
        q: "",
        ene: 'afa'
    };

    // wrap wouter's location to fill in default values and split up the path and the query string.
    const [location, query] = useMemo(() => {
        const merged = {
            ...defaults,
            ...qs.parse(_location.search)
        }
        return [_location.path, merged]
    }, [_location]);

    // wrapper around wouter's setLocation that uses implicit default values 
    const setLocation = (path, search) => {
        const diffed = diff(search, defaults);
        _setLocation(`${path}${qs.stringify(diffed, true)}`);
    }

    return (
        <>
            <Header />
            <Levels route={setLocation} {...query} />
        </>
    )
}