import { html } from "../utils/html.js";

import cn from "https://cdn.skypack.dev/classnames";

export function SearchOptionsBox({_class}) {

	return html`
		<div class=${cn("search-options", _class)}>
			<div class="search-options_search">
				<input class="search-options_input" type="text" placeholder="Search..." />
				<div class="search-options_sep"></div>
				<button class="search-options_button">
					<i class="fad fa-search fa-swap-opacity"></i>
				</button>
			</div>
			<ul class="search-options_twine">
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-pager"></i>
					</span>
					<p>Display 10 levels per page</p>
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-sort-shapes-up-alt"></i>
					</span>
					<p>Sort by eprhpaowehfpawoef</p>
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-clipboard-check"></i>
					</span>
					<p>Hide unreferred levels</p>
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-directions"></i>
					</span>
					<p>Show auto-import links</p>
				</li>
			</ul>
		</div>
	`
}