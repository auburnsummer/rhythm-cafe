import { WithClass } from '@orchard/utils/types';
import { Level } from '@orchard/hooks/useLevels/types';
import cc from 'clsx';
import './DifficultyDecorator.css';
import { DIFFICULTY_STRINGS } from '@orchard/utils/constants';

const DIFFICULTY_CLASSES = [
    'easy!dd',
    'medium!dd',
    'tough!dd',
    'souls!dd'
];

type DifficultyDecoratorProps = Pick<Level, 'difficulty'> & WithClass;
export function DifficultyDecorator({difficulty, 'class': _class}: DifficultyDecoratorProps) {
    const difficultyString = DIFFICULTY_STRINGS[difficulty];
    const difficultyClass = DIFFICULTY_CLASSES[difficulty];

    return (
        <div class={cc(_class, 'dd', difficultyClass)}>
            <span role="presentation" class="dd_triangle"></span>
            <span class="dd_text">{difficultyString}</span>
        </div>
    );
}