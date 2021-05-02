import { h } from 'preact';
import { useMemo, useState, useEffect } from "preact/hooks";
import cc from "classcat";

import { SortOptions, LoadingState } from "../utils/constants";
import { useDatasette } from "../hooks/useDatasette";

import { LevelBox } from "./LevelBox";

import "./Levels.css";
import { RouteFunction } from '../utils/types';

type LevelsArgs = {
	_class: string,
	route: RouteFunction,
	tags: Array<string>,
	authors: Array<string>,
	search: string,
	limit: number,
	page: number,
	show_x: boolean,
	sort: SortOptions
}


export function Levels({_class, route, tags, authors, search, limit, page, show_x, sort}: LevelsArgs) {
    // make the sql query:
	const sql = useMemo(() => {
		const offset = limit * page;
		// https://github.com/auburnsummer/rdlevels2/issues/1
		const sortStrings = {
			[SortOptions.newest]: "uploaded DESC, last_updated DESC",
			[SortOptions.oldest]: "last_updated ASC, uploaded ASC",
			[SortOptions.artistaz]: "artist ASC",
			[SortOptions.artistza]: "artist DESC",
			[SortOptions.songaz]: "song ASC",
			[SortOptions.songza]: "song DESC"
		}

		const tagsWhere = tags.length ? `
		AND L.id IN (
			SELECT T.id FROM level_tag AS T
			WHERE T.tag LIKE ${tags.map(t => `'${t}%'`).join(' OR T.tag LIKE ')}
			GROUP BY T.id
			HAVING count(DISTINCT T.tag) >= ${tags.length}
		)		
		` : '';
		const authorsWhere = authors.length ? `
		AND L.id IN (
			SELECT A.id FROM level_author AS A
			WHERE A.author LIKE ${authors.map(a => `'${a}%'`).join(' OR A.author LIKE ')}
			GROUP BY A.id
			HAVING count(DISTINCT A.author) >= ${authors.length}
		)
		` : '';

		const approvedWhere = !show_x ? `
		AND approval >= 10
		` : '';

		const sourceWhere = `
		AND source_id IN ('rdl', 'yeoldesheet', 'workshop')
		`;

		const subquery = search.length === 0 ? `
		SELECT L.*, row_number() OVER (
			ORDER BY ${sortStrings[sort]}
		) AS rn FROM levels AS L
		WHERE True
		${tagsWhere}
		${authorsWhere}
		${approvedWhere}
		${sourceWhere}
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
			${sourceWhere}
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
	}, [tags, authors, search, limit, page, sort, show_x]);

	// pass the sql query into the useDatasette hook, which is where the data fetching
	// actually happens.
    const [results, error, state] = useDatasette(sql);

	if (state === LoadingState.Loading) {
		return (
			<div>
				loading
			</div>
		)
	}

    return (
        <main class={cc(["le", _class])}>
			<ul class="le_list">
				{
					results.map(r => (
						<li class="le_item">
							<LevelBox level={r} />
						</li>
					))
				}
			</ul>
		</main>
    )
}