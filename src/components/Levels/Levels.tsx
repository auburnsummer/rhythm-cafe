import { WithClass } from '@orchard/utils/types';
import { useLevels } from '@orchard/hooks/useLevels';
import cc from 'clsx';


import './Levels.css';
import { usePage } from '@orchard/store';
import { Announcements } from '@orchard/components/Announcements';
import { LevelsControls } from '@orchard/components/LevelsControls';
import { LevelsList } from '@orchard/components/LevelsList';


type LevelsProps = WithClass;
export function Levels({'class': _class}: LevelsProps) {
    const { data: resp, error, isLagging } = useLevels();
    const [ page ] = usePage();

    return (
        <main class={cc(_class, 'lv')}>
            {
                error && error.data && (
                    <div>An error occured: {JSON.stringify(error.data)}, {error.status}. If you keep seeing this, please ping auburn now!!!!!</div>
                )
            }
            {
                !resp && <div class="lv_loading">Loading...</div>
            }
            {
                resp && resp.data.hits && (
                    <>
                        {page === 1 && <Announcements class="lv_announcements" />}
                        <LevelsControls class="lv_controls" />
                        <LevelsList
                            hits={resp.data.hits}
                            class={['lv_loaded', {'laggy!lv_loaded': isLagging}]}
                        />
                    </>
                )
            }
        </main>
    );
}