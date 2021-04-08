import { h } from 'preact';

export function LevelBox({level}) {
	const approved = level.approval >= 10;

	const approvedDescriptions = [
		"Peer-Reviewed: A trusted member of the community has checked for correct timing, metadata, and cues.",
		"Non-Referred: A trusted member of the community has checked for correct timing, metadata, and cues, and has found that the level does not meet standards."
	]

    return (
        <article>
            <div>
                <img src={level.thumb} />
                <div>
                    
                </div>
            </div>
            {JSON.stringify(level)}
        </article>
    )
}