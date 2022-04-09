import { useStore } from "@orchard/hooks/useStore";
import { WithClass } from "@orchard/types";
import cc from "clsx";
import "./SearchBar.css";

type SearchBarProps = {} & WithClass;

export function SearchBar({"class": _class}: SearchBarProps) {
    const q = useStore(state => state.q);
    const setQuery = useStore(state => state.setQuery);

    return (
        <div class={cc(_class, "se")}>
            <div class="se_bar">
                <input
                    value={q}
                    onInput={evt => setQuery(evt.currentTarget.value)}
                    class="se_input"
                    placeholder="Search..."
                />
            </div>
        </div>
    )
}