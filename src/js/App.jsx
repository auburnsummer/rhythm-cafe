import { h, Fragment } from 'preact';
import { Header } from "./parts/Header";
import { Levels } from "./parts/Levels";

export function App() {

    return (
        <>
            <Header />
            <Levels />
        </>
    )
}