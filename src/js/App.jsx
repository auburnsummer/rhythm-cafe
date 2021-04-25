import { h, Fragment } from 'preact';
import { Header } from "./parts/Header";
import { Levels } from "./parts/Levels";

import qs from "querystringify";

import { useEffect, useMemo } from "preact/hooks";
import { useLocation}  from "./hooks/useLocation";

import { diff } from "./utils";

export function App() {
    const [_location, _setLocation] = useLocation();

    const defaults = {
        q: "",
        ene: 'afa'
    };

    const [location, query] = useMemo(() => {
        const merged = {
            ...defaults,
            ...qs.parse(_location.search)
        }
        return [_location.path, merged]
    }, [_location]);

    const setLocation = (path, search) => {
        const diffed = diff(search, defaults);
        _setLocation(`${path}${qs.stringify(diffed, true)}`);
    }

    useEffect(() => {
        console.log("change!");
        console.log(query);
    }, [query]);

    return (
        <>
            <Header />
            <Levels route={setLocation} {...query} />
        </>
    )
}