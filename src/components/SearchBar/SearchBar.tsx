import { Search } from '@orchard/icons';
import { As, usePreference, useQuery } from '@orchard/store';
import { WithClass } from '@orchard/utils/types';
import cc from 'clsx';
import { useState } from 'preact/hooks';
import { useDebounce } from 'react-use';
import './SearchBar.css';

type SearchBarProps = WithClass;

export function SearchBar({'class': _class}: SearchBarProps) {
    const [q, setQuery] = useQuery();
    const [text, setText] = useState(q);
    const [liveSearch] = usePreference('search as you type', As.BOOLEAN);

    const doSearch = (e: Event) => {
        e.preventDefault();
        if (!liveSearch) {
            setQuery(text);
        }
    };

    useDebounce(() => {
        if (liveSearch) {
            setQuery(text);
        }
    },
    100,
    [text]
    );

    return (
        <div class={cc(_class, 'se')}>
            <form class={cc('se_bar', {'live!se_bar': liveSearch})} onSubmit={doSearch}>
                <input
                    value={text}
                    onInput={evt => setText(evt.currentTarget.value)}
                    class="se_input"
                    placeholder="What do you feel like playing today?"
                />
                <button type="submit" aria-label="Search" class="se_button">
                    <Search class="se_mag" />
                </button>
            </form>
        </div>
    );
}