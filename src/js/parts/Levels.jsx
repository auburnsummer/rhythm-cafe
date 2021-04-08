import { h } from 'preact';
import { useMemo, useState, useEffect } from "preact/hooks";
import { SortOptions, LoadingState } from "../utils";
import { useDatasette } from "../hooks/useDatasette";

import { LevelBox } from "./LevelBox";

export function Levels() {
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState(0);
    const [sort, setSort] = useState(SortOptions.Newest);
	// tags and authors are comma separated strings
	const [tags, setTags] = useState("");
	const [authors, setAuthors] = useState("");
	const [search, setSearch] = useState("");
	const [showUnapproved, setShowUnapproved] = useState(false);

    // make the sql query:
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

		const tagList = (tags || "").split(",");
		const authorsList = (authors || "").split(",");

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

		const approvedWhere = !showUnapproved ? `
		AND approval >= 10
		` : '';

		const subquery = search.length === 0 ? `
		SELECT L.*, row_number() OVER (
			ORDER BY ${sortStrings[sort]}
		) AS rn FROM levels AS L
		WHERE True
		${tagsWhere}
		${authorsWhere}
		${approvedWhere}
		LIMIT ${limit} OFFSET ${offset}
		` : `
		SELECT L.*, S.*, row_number() OVER (
			ORDER BY rank
		) AS rn FROM ft
		INNER JOIN level AS L ON ft._rowid_ = L._rowid_
		INNER JOIN status AS S ON S.id = L.id
		WHERE ft MATCH '${search}'
			${tagsWhere}
			${authorsWhere}
			${approvedWhere}
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
	}, [tags, authors, search, limit, offset, sort, showUnapproved]);

    const [results, error, state] = useDatasette(sql);

	if (state === LoadingState.Loading) {
		console.log("hfiehfiefhief");
		return (
			<div>
				loading
			</div>
		)
	}

    return (
        <div>
			<h1>hello world</h1>
			<ul>
				{
					results.map(r => (
						<li>
							<LevelBox level={r} />
						</li>
					))
				}
			</ul>
		</div>
    )
}