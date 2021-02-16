import { html } from "../utils/html.js";

import { useState } from "https://cdn.skypack.dev/preact/hooks";
import cn from "https://cdn.skypack.dev/classnames";
import TokenInput from 'https://cdn.skypack.dev/preact-token-input';
import { map } from "https://cdn.skypack.dev/ramda";

import { setThis } from "../utils/functions.js";
import { useTwineSwitch } from "../hooks/useTwineSwitch.js";
import { SortOptions } from "../utils/enums.js";

export function SearchOptionsBox({
	_class,
	tags,
	setTags,
	authors,
	setAuthors,
	showAutoimport,
	setShowAutoimport,
	limit,
	setLimit,
	sort,
	setSort,
	search,
	setSearch
}) {

	const rotateAutoimport = useTwineSwitch([true, false], showAutoimport, setShowAutoimport);

	const [inputContent, setInputContent] = useState("");

	const handleSubmit = evt => {
		setSearch(() => inputContent);
		evt.preventDefault();
	}

	return html`
		<div class=${cn("sb", _class)}>
			<form onsubmit=${handleSubmit} class="sb_form">
				<input value=${inputContent} onchange=${setThis(setInputContent)} class="sb_input" type="text" placeholder="Search..." />
				<div class="sb_sep"></div>
				<button type="submit" value="Search" class="sb_button">
					<i class="fad fa-search fa-swap-opacity"></i>
				</button>
			</form>
			<ul class="sb_twine">
				<li class="sb_row">
					<span class="sb_icon">
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
				<li class="sb_row">
					<span class="sb_icon">
						<i class="fad fa-pencil-alt"></i>
					</span>
					<span>
						Search levels made by
					</span>
					<${TokenInput} value=${authors} onchange=${setThis(setAuthors)} />
				</li>
				<li class="sb_row">
					<span class="sb_icon">
						<i class="fad fa-pager"></i>
					</span>
					<span>
						Display
					</span>
					<span>
						<select
							class="sb_select"
							name="limit"
							id="limit"
							value=${limit}
							onchange=${evt => setLimit(parseInt(evt.target.value))}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
							<option value="150">150</option>
						</select>
					</span>
					<span>
						levels per page
					</span>
				</li>
				<li class="sb_row">
					<span class="sb_icon">
						<i class="fad fa-sort-shapes-up-alt"></i>
					</span>
					<span>
						Sort by
					</span>
					<span>
						<select
						value=${search.length === 0 ? sort : "Relevance"}
						onchange=${setThis(setSort)}
						class="sb_select"
						name="sort"
						id="sort"
						disabled=${search.length > 0}>
							${
								search.length > 0 ?
								html`<option value="Relevance">Relevance</option>` :
								map(
									en => html`<option value=${en.key}>${en.key}</option>`,
									SortOptions.enums
								)
							}

						</select>
					</span>
				</li>
				<li class="sb_row">
					<span class="sb_icon">
						<i class="fad fa-clipboard-check"></i>
					</span>
					<span>Hide unreferred levels</span>
				</li>
				<li class="sb_row">
					<span class="sb_icon">
						<i class="fad fa-directions"></i>
					</span>
					<span>
					<button class="sb_toggle" onClick=${rotateAutoimport(1)}>${showAutoimport ? "Show" : "Hide"}</button> auto-import links</span>
				</li>
			</ul>
		</div>
	`
}