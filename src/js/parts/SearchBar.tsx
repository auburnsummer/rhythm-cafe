import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import cc from "classcat";

import "./SearchBar.css";

import { SearchOptions } from "./SearchOptions";
import { QueryParams, RouteFunction } from '../utils/types';
import { id, setThis } from '../utils/helpers';

import { LanguageContext } from "../hooks/LanguageContext";

type SearchBarArgs = {
    _class: string,
    route: RouteFunction,
    query: QueryParams
}

export function SearchBar({
    _class, route, query,
}: SearchBarArgs) {
    const { text } = useContext(LanguageContext);

    const [optionsVisible, setOptionsVisible] = useState(false/* true */);

    const [barText, setBarText] = useState(query.q);
    const [limit, setLimit] = useState(query.limit);
    const [showX, setShowX] = useState(query.show_x);
    const [sort, setSort] = useState(query.sort);

    const submitHandler = (evt: Event) => {
        evt.preventDefault();
        evt.stopPropagation();
        route('/', {
            q: barText,
            limit: limit.toString(),
            show_x: showX.toString(),
            sort,
            page: "0",
        }, false);
    }

    return (
        <div class={cc(["sb", _class])}>
            <form class="sb_bar" onSubmit={submitHandler}>
                <input
                    class="sb_input"
                    placeholder={text("search_placeholder")}
                    value={barText}
                    onChange={setThis(setBarText, id)}
                />
                <div class="sb_togglewrapper">
                    <button type="button" class="sb_filtertoggle" onClick={() => setOptionsVisible(p => !p)}>
                        {
                            optionsVisible
                                ? <i class="fas fa-times" />
                                : <i class="fas fa-filter" />
                        }
                    </button>
                    <SearchOptions
                        _class={cc(["sb_optionbox", {"visible!sb_optionbox": optionsVisible}])}
                        {...{
                            limit,
                            setLimit,
                            showX,
                            setShowX,
                            sort,
                            setSort,
                        }}
                    />
                </div>
                <button type="submit" class="sb_button">
                    <i class="fad fa-search" />
                </button>
            </form>
        </div>
    )
}
