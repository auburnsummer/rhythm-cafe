import { html } from "../utils/html.js";

import cn from "https://cdn.skypack.dev/classnames";
import TokenInput from 'https://cdn.skypack.dev/preact-token-input';
import {setThis} from "../utils/functions.js";

export function SearchOptionsBox({
	_class,
	tags,
	setTags,
	authors,
	setAuthors
}) {

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
						<i class="fad fa-tags"></i>
					</span>
					<span>
						Search levels with
					</span>
					<${TokenInput} value=${tags} onchange=${setThis(setTags)} />
					<span>
						tags
					</span>
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-pencil-alt"></i>
					</span>
					<span>
						Search levels made by
					</span>
					<${TokenInput} value=${authors} onchange=${setThis(setAuthors)} />
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-pager"></i>
					</span>
					<span>
						Display
					</span>
					<span>
						<select class="search-options_select" name="cars" id="cars">
							<option value="volvo">Volvo</option>
							<option value="saab">Saab</option>
							<option value="mercedes">Mercedes</option>
							<option value="audi">Audi</option>
						</select>
					</span>
					<span>
						levels per page
					</span>
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-sort-shapes-up-alt"></i>
					</span>
					<span>
						Sort by
					</span>
					<span>
						<select class="search-options_select" name="cars" id="cars">
							<option value="volvo">Volvo</option>
							<option value="saab">Saab</option>
							<option value="mercedes">Mercedes</option>
							<option value="audi">Audi</option>
						</select>
					</span>
					<span>
						, a-z
					</span>
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-clipboard-check"></i>
					</span>
					<span>Hide unreferred levels</span>
				</li>
				<li class="search-options_row">
					<span class="search-options_row-icon">
						<i class="fad fa-directions"></i>
					</span>
					<span>Show auto-import links</span>
				</li>
			</ul>
		</div>
	`
}