import { html } from "../utils/html.js";

import { DifficultyDecoration } from "./DifficultyDecoration.js";
import { map } from 'https://cdn.skypack.dev/ramda';


const formatter = new Intl.ListFormat('en', { style: 'short', type: 'conjunction' });

const bpmText = (maxBPM, minBPM) => maxBPM === minBPM ? `${maxBPM} BPM` : `${minBPM}-${maxBPM} BPM`;

export function LevelBox({level}) {
	return html`
		<div class="level-box">
			<div class="level-box_image-box">
				<div class="level-box_image-box_wrapper">
                    <img class="level-box_image-box_image" src=${level.thumb} />
                </div>
			</div>
			<div class="level-box_info">
				<${DifficultyDecoration} _class="level-box_decorator" difficulty=${level.difficulty} />
				<div class="level-box_info_title">
					<h2 class="level-box_artist">${level.artist}</h2>
					<h1 class="level-box_song">${level.song}</h1>
					<div class="level-box_info-wrapper">
						<ul class="level-box_info-icons">
							<li class="level-box_icon">
								<i class="fad fa-pencil-alt"></i>
								<span>${formatter.format(level.authors)}</span>
							</li>
							<li class="level-box_icon">
								<i class="fad fa-triangle-music"></i>
								<span>${bpmText(level.max_bpm, level.min_bpm)}</span>
							</li>
							<li class="level-box_icon">
								<i class="fab fa-discord"></i>
								<span>Rhythm Doctor Lounge</span>
							</li>
						</ul>
					</div>
					<div class="level-horizontal_spacer"></div>
					<div class="level-box_tags-wrapper">
						<ul class="level-box_tags">
							${map(
								tag => html`<span class="level-box_tag">${tag}</span>`,
								level.tags
							)}
						</ul>
					</div>

				</div>

			</div>
		</div>
	`
}