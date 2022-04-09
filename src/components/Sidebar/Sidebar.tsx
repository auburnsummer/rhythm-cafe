import "./Sidebar.css";
import cc from "clsx";
import { WithClass } from "@orchard/types";

type SidebarProps = {} & WithClass;
export function Sidebar({"class": _class}: SidebarProps) {
    return (
        <aside class={cc(_class, "sb")}>

        </aside>
    )
}