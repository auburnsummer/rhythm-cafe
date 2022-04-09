import "./App.css"
import { Header } from "@orchard/components/Header"
import { Levels } from "@orchard/components/Levels"
import { Sidebar } from "@orchard/components/Sidebar"

export function App() {
  return (
    <div class="ap">
      <Header class="ap_header" />
      <div class="ap_layout">
        <Sidebar class="ap_sidebar" />
        <Levels class="ap_levels" />
      </div>
    </div>
  )
}
