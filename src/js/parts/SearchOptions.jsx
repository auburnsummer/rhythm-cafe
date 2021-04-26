import { h } from "preact";

import "./SearchOptions.css";
import cc from "classcat";

import { SortOptions } from "../utils/constants";

export function SearchOptions({_class, text}) {
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
                    <span>
                        <select
                            class="so_select"
                            name="limit"
                            id="limit"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="150">150</option>
                        </select>
                    </span>
                    <span>
                        {text("prompt_limit_2")}
                    </span>
                </li>
                <li class="so_row so_sort">
                    <span class="sb_icon">
						<i class="fad fa-sort-shapes-up-alt"></i>
					</span>
					<span>
						{text('prompt_sort_1')}
					</span>
					<span>
						<select
						class="sb_select"
						name="sort"
						id="sort">
                        {
                            SortOptions.enums.map(({key}) => <option value={key}>{text(`sort_${key}`)}</option>)
                        }
					</select>
					</span>
                    <span>
                        {text('prompt_sort_2')}
                    </span>
                </li>
                <li class="so_row so_deusovi">
                    <span class="sb_icon">
						<i class="fad fa-clipboard-check"></i>
					</span>
                    <span>
                        {text("prompt_deusovi_1")}
                    </span>
                    <select
						class="sb_select"
						name="deusovi"
						id="deusovi">
                        <option>{text("deusovi_show")}</option>
                        <option>{text("deusovi_hide")}</option>
					</select>
                    <span>
                        {text("prompt_deusovi_2")}
                    </span>
                </li>
            </ul>
            
        </div>
    )
}