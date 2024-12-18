import type { WithClass } from '@orchard/utils/types';
import cc from 'clsx';
import './Announcements.css';

type AnnouncementsProps = WithClass;

export function Announcements({ 'class': _class } : AnnouncementsProps) {
    return (
        <ul class={cc(_class, 'an')}>
            <li class="an_announcement"> {/* an announcement lol */}
                Not sure where to start? Try the <a href="https://docs.google.com/spreadsheets/d/1Uz26L34OZIgaK6hMfLBysgtEW4TYDj7iZZ5KqOMbNKY">RDL Setlists!</a>
            </li>
            <li class="an_announcement">
                <a href="https://rd-editor-docs.github.io/intro/">Level editor tutorial</a> by Klyzx et al
            </li>
        </ul>
    );

}
