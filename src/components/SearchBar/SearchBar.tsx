import { useQuery } from "@orchard/store";
import { WithClass } from "@orchard/utils/types";
import cc from "clsx";
import "./SearchBar.css";

type SearchBarProps = {} & WithClass;

export function SearchBar({"class": _class}: SearchBarProps) {
    const [q, setQuery] = useQuery();

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