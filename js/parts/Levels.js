import { html } from "../utils/html.js";
import { LevelBox } from "./LevelBox.js";
import { map, max } from 'https://cdn.skypack.dev/ramda';
import { setThis } from "../utils/functions.js";
import { useMemo, useState } from "https://cdn.skypack.dev/preact/hooks";

import { SortOptions } from "../utils/enums.js";

import { useSelect } from "../hooks/useSelect.js";

export function Levels({worker}) {

	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);
	const [sort, setSort] = useState(SortOptions.Newest);

	// bound component.
	const [inputContent, setInputContent] = useState("");

	// what the current search is
	const [search, setSearch] = useState("");

	const sql = useMemo(() => {

		const sortStrings = {
			[SortOptions.Newest]: "uploaded DESC, last_updated DESC",
			[SortOptions.Oldest]: "last_updated ASC, uploaded ASC",
			[SortOptions.ArtistAToZ]: "artist ASC",
			[SortOptions.ArtistZToA]: "artist DESC",
			[SortOptions.SongAToZ]: "song ASC",
			[SortOptions.SongZToA]: "song DESC"
		}

		const innerQuery =
			search === "" ?
			`SELECT
			l.*,
			ROW_NUMBER() OVER (ORDER BY ${sortStrings[sort]}) AS row_num
			FROM levels AS l
			LIMIT ${limit} OFFSET ${offset}
			` :
			`
			
			`



		return `
			SELECT * FROM level
			INNER JOIN status ON level.id = status.id
			ORDER BY ${sortStrings[sort]}
			LIMIT ${limit} OFFSET ${offset}
		`
	}, [limit, offset, sort]);

	const [levels, state] = useSelect(worker, sql);

	const makeLevelBox = level => {
		return html`
			<li>
				<${LevelBox} level=${level} />
			</li>
		`
	}

	const makeSortOption = op => {
		const texts = {
			[SortOptions.Newest]: "Newest",
			[SortOptions.Oldest]: "Oldest",
			[SortOptions.ArtistAToZ]: "Artist, a to z",
			[SortOptions.ArtistZToA]: "Artist, z to a",
			[SortOptions.SongAToZ]: "Song, a to z",
			[SortOptions.SongZToA]: "Song, z to a"
		}
		return html`
			<option value=${op}>${texts[op]}</option>
		`
	}

	const prevPage = () => setOffset(prev => max(prev - 10, 0));
	const nextPage = () => setOffset(prev => prev + 10);

	return html`
		<div class="levels">
			<h1>level page</h1>
			<form class="levels_search-bar">
				<input value=${inputContent} onchange=${setThis(setInputContent)} placeholder="What do you feel like playing today?"></input>
				<button type="button" onclick=${() => setSearch(inputContent)}>Search!!!</button>
			</form>
			<br/>
			<button type="button" onclick=${prevPage}>Prev page</button>
			<button type="button" onclick=${nextPage}>Next page</button>
			<br />
			<label for="sort">Sort by:</label>
			<select id="sort" value=${sort} onchange=${setThis(setSort)}>
				${map(makeSortOption, SortOptions.enums)}
			</select>
			<ul>
				${map(makeLevelBox, levels)}
			</ul>
		</div>
	`
}