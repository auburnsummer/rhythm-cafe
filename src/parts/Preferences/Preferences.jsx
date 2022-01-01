import "./Preferences.css";

import cc from "clsx";
import { Menu, Popover } from "@headlessui/react";

export function Preferences({"class": _class}) {
    return (
        <Popover class={cc(_class, "pr")}>
            <Popover.Button class={cc(_class, "pr_button")}>
                <i class="fas fa-wrench pr_icon"></i>
            </Popover.Button>

            <Popover.Panel class="pr_panel">
                <p>ejwopfjwepojfopwe</p>
            </Popover.Panel>
        </Popover>
    )
}