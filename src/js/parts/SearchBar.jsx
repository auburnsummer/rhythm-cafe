import { h } from 'preact';
import { useState } from 'preact/hooks';

import cc from "classcat";

import "./SearchBar.css";

import { SearchOptions } from "./SearchOptions";

export function SearchBar({_class, text}) {

    const [optionsVisible, setOptionsVisible] = useState(true/*false*/);

    return (
        <div class={cc(["sb", _class])}>
            <form class="sb_bar">
                <input 
                    class="sb_input"
                    placeholder={text("search_placeholder")}
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
                    <SearchOptions _class={cc(["sb_optionbox", {"visible!sb_optionbox" : optionsVisible}])} text={text} />
                </div>
                <button type="button" class="sb_button">
                    <i class="fad fa-search"></i>
                </button>
            </form>
        </div>
    )
}