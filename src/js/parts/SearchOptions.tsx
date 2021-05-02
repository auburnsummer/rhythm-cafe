import { h } from "preact";

import "./SearchOptions.css";
import cc from "classcat";

import { SortOptions } from "../utils/constants";
import { StateUpdater, useEffect } from "preact/hooks";
import { id, setThis } from "../utils/helpers";

type SearchOptionArgs = {
    _class: string,
    text: (id: string) => string,
    limit: number,
    setLimit: StateUpdater<number>,
    showX: boolean,
    setShowX: StateUpdater<boolean>,
    sort: SortOptions,
    setSort: StateUpdater<SortOptions>
}

export function SearchOptions({_class, text, limit, setLimit, showX, setShowX, sort, setSort}: SearchOptionArgs) {

    return (
        <div class={cc(["so", _class])}>
            <ul class="so_twine">
                <li class="so_row so_limit">
                    <span class="so_icon">
                        <i class="fad fa-pager"></i>
                    </span>
                    <span>
                        {text("prompt_limit_1")}
                    </span>
                    <select
                        class="so_select"
                        name="limit"
                        id="limit"
                        value={limit}
                        onChange={setThis(setLimit, parseInt)}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="40">40</option>
                        <option value="80">80</option>
                    </select>
                    <span>
                        {text("prompt_limit_2")}
                    </span>
                </li>
                <li class="so_row so_sort">
                    <span class="so_icon">
						<i class="fad fa-sort-shapes-up-alt"></i>
					</span>
					<span>
						{text('prompt_sort_1')}
					</span>
					<select
                    class="so_select"
                    name="sort"
                    id="sort"
                    value={sort}
                    onChange={setThis(setSort, s => s as SortOptions)}>
                        {
                            Object.keys(SortOptions).map(key => <option value={key}>{text(`sort_${key}`)}</option>)
                        }
					</select>
                    <span>
                        {text('prompt_sort_2')}
                    </span>
                </li>
                <li class="so_row so_deusovi">
                    <span class="so_icon">
						<i class="fad fa-clipboard-check"></i>
					</span>
                    <span>
                        {text("prompt_deusovi_1")}
                    </span>
                    <select
						class="so_select"
						name="deusovi"
						id="deusovi"
                        value={showX ? "true" : "false"}
                        onChange={setThis(setShowX, s => s === "true")}
                    >
                        <option value="true">{text("deusovi_show")}</option>
                        <option value="false">{text("deusovi_hide")}</option>
					</select>
                    <span>
                        {text("prompt_deusovi_2")}
                    </span>
                </li>
            </ul>
            
        </div>
    )
}