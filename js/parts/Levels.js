import { html } from "../utils/html.js";
import { LevelBox } from "./LevelBox.js";
import { split, max, map } from 'https://cdn.skypack.dev/ramda';
import { setThis } from "../utils/functions.js";
import { useMemo, useState, useEffect } from "https://cdn.skypack.dev/preact/hooks";

import { SortOptions } from "../utils/enums.js";
import { useSelect } from "../hooks/useSelect.js";
import { SearchOptionsBox } from "./SearchOptionsBox.js";

export function Levels({worker}) {
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);
	const [sort, setSort] = useState(SortOptions.Newest);
	const [tags, setTags] = useState("");
	const [authors, setAuthors] = useState("");
	const [showAutoimport, setShowAutoimport] = useState(false);
	const [search, setSearch] = useState("");


	const sql = useMemo(() => {
		// https://github.com/auburnsummer/rdlevels2/issues/1
		const sortStrings = {
			[SortOptions.Newest]: "uploaded DESC, last_updated DESC",
			[SortOptions.Oldest]: "last_updated ASC, uploaded ASC",
			[SortOptions.ArtistAToZ]: "artist ASC",
			[SortOptions.ArtistZToA]: "artist DESC",
			[SortOptions.SongAToZ]: "song ASC",
			[SortOptions.SongZToA]: "song DESC"
		}

		const tagList = split(",", tags || "");
		const authorsList = split(",", authors || "");

		const tagsWhere = tags.length ? `
		AND L.id IN (
			SELECT T.id FROM level_tag AS T
			WHERE T.tag LIKE ${tagList.map(t => `'${t}%'`).join(' OR T.tag LIKE ')}
			GROUP BY T.id
			HAVING count(DISTINCT T.tag) >= ${tagList.length}
		)		
		` : '';
		const authorsWhere = authors.length ? `
		AND L.id IN (
			SELECT A.id FROM level_author AS A
			WHERE A.author LIKE ${authorsList.map(a => `'${a}%'`).join(' OR A.author LIKE ')}
			GROUP BY A.id
			HAVING count(DISTINCT A.author) >= ${authorsList.length}
		)
		` : '';

		const subquery = search.length === 0 ? `
		SELECT L.*, row_number() OVER (
			ORDER BY ${sortStrings[sort]}
		) AS rn FROM levels AS L
		WHERE True
		${tagsWhere}
		${authorsWhere}
		LIMIT ${limit} OFFSET ${offset}
		` : `
		SELECT L.*, row_number() OVER (
			ORDER BY rank
		) AS rn FROM ft
		INNER JOIN level AS L ON ft._rowid_ = L._rowid_
		INNER JOIN status AS S ON S.id = L.id
		WHERE ft MATCH '${search}'
			${tagsWhere}
			${authorsWhere}
		LIMIT ${limit} OFFSET ${offset}
		`

		return `
		SELECT Q.*, T.tag, T.seq AS tag_seq, A.author, A.seq AS author_seq FROM (
			${subquery}
		) AS Q
		LEFT JOIN level_tag AS T ON T.id = Q.id
		LEFT JOIN level_author AS A ON A.id = Q.id
		ORDER BY rn
		`
	}, [tags, authors, search, limit, offset, sort]);

	const [levels, state] = useSelect(worker, sql);

	useEffect(() => {
		console.log("levels:")
		console.log(levels);
	}, [levels]);

	const makeLevelBox = level => {
		return html`
			<li>
				<${LevelBox} level=${level} />
			</li>
		`
	}


	const prevPage = () => setOffset(prev => max(prev - 10, 0));
	const nextPage = () => setOffset(prev => prev + 10);

	return html`
		<div class="le">
			<div class="le_list">
				<button onclick=${prevPage}>previous page</button>
				<button onclick=${nextPage}>next page</button>
				${map(
					level => html`<${LevelBox} level=${level} _class="le_box" />`,
					levels
				)}
			</div>
			<${SearchOptionsBox}
			  _class="le_search" 
			  ...${
				{
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
				}
			}
			/>
		</div>
	`
}