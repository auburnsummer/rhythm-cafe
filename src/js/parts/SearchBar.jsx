import { h } from 'preact';
import { useState } from 'preact/hooks';

import cc from "classcat";

import "./SearchBar.css";

import { SearchOptions } from "./SearchOptions";

export function SearchBar({_class, text}) {

    return (
        <div class={cc(["sb", _class])}>
            <form class="sb_bar">
                <input 
                    class="sb_input"
                    placeholder={text("search_placeholder")}
                >
                </input>
                <button type="button" class="sb_filtertoggle">
                    <i class="fas fa-filter"></i>
                </button>
                <SearchOptions _class={cc(["sb_optionbox"])} text={text} />
                <button type="button" class="sb_button">
                    <i class="fad fa-search"></i>
                </button>
            </form>
        </div>
    )
}