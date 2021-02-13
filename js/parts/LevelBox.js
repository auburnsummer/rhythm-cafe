import { html } from "../utils/html.js";

import { DifficultyDecoration } from "./DifficultyDecoration.js";

export function LevelBox({level}) {
	return html`
		<div class="level-box">
			<div class="level-box_image-box">
				<div class="level-horizontal_image-box_wrapper">
                    <img class="level-horizontal_image-box_image" src=${level.thumb} />
                </div>
			</div>
			<div class="level-box_info">
				<${DifficultyDecoration} _class="level-box_decorator" difficulty=${level.difficulty} />
				<div class="level-box_info_wrapper">
					<h2 class="level-box_artist">${level.artist}</h2>
					<h1 class="level-box_song">${level.song}</h1>
				</div>
			</div>
		</div>
	`
}