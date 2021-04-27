import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import cc from "classcat";

import "./SearchBar.css";

import { SearchOptions } from "./SearchOptions";

export function SearchBar({_class, text, route, query}) {

    const [optionsVisible, setOptionsVisible] = useState(false/*true*/);

    const [barText, setBarText] = useState(query.q);
    const [limit, setLimit] = useState(query.limit);
    const [showX, setShowX] = useState(query.show_x);
    const [sort, setSort] = useState(query.sort);

    const clickHandler = _ => {
        route('/', {
            q: barText,
            limit,
            show_x: showX,
            sort,
            page: 0
        })
    }

    return (
        <div class={cc(["sb", _class])}>
            <form class="sb_bar">
                <input 
                    class="sb_input"
                    placeholder={text("search_placeholder")}
                    value={barText}
                    onChange={evt => setBarText(evt.target.value)}
                >
                </input>
                <div class="sb_togglewrapper">
                    <button type="button" class="sb_filtertoggle" onClick={() => setOptionsVisible(p => !p)}>
                        {
                            optionsVisible ?
                            <i class="fas fa-times"></i> : 
                            <i class="fas fa-filter"></i>
                        }
                    </button>
                    <SearchOptions
                        _class={cc(["sb_optionbox", {"visible!sb_optionbox" : optionsVisible}])}
                        text={text}
                        {...{
                            limit,
                            setLimit,
                            showX,
                            setShowX,
                            sort,
                            setSort
                        }}
                    />
                </div>
                <button type="button" class="sb_button" onClick={clickHandler}>
                    <i class="fad fa-search"></i>
                </button>
            </form>
        </div>
    )
}