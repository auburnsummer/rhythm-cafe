import { h, Fragment } from 'preact';
import { Header } from "./parts/Header";
import { Levels } from "./parts/Levels";

import qs from "querystringify";
import { useEffect, useMemo } from "preact/hooks";
import { useLocation}  from "./hooks/useLocation";

import { diff } from "./utils/helpers";
import { searchParser } from "./utils/searchParser";

import texts from "../resources/text.yaml";

import "./App.css";

const getText = locale => id => texts[id][locale];

export function App() {
    // default values for various query params.
    const queryDefaults = {
        q: "",      // user's search query
        limit: 20,
        page: 0,
        show_x: false,
        sort: 'newest'
    };

    // modified useLocation hook from wouter to also include the query string (bit after the ?)
    const [_location, _setLocation] = useLocation();

    // using _location, make a query object with the default values.
    const [location, query] = useMemo(() => {
        const merged = {
            ...queryDefaults,
            ...qs.parse(_location.search)
        }
        return [_location.path, merged]
    }, [_location]);

    // wrapper around wouter's setLocation that uses implicit default values from above
    const setLocation = (path, search) => {
        console.log(search);
        console.log(queryDefaults);
        const diffed = diff(search, queryDefaults);
        _setLocation(`${path}${qs.stringify(diffed, true)}`);
    }

    // for now, just english.
    const text = getText("en");

    // use searchParser to break up the query into seperate tag author search
    const processed = useMemo(() => {
		return searchParser(query.q);
	}, [query.q]);

    return (
        <div class="ap">
            <Header
                _class="ap_header"
                text={text}
                route={setLocation}
                query={query} />
            <Levels _class="ap_levels" route={setLocation} {...processed} {...query} />
        </div>
    )
}