import { createContext } from "preact";
import { StateUpdater } from "preact/hooks";

type LanguageContext = {
    lang: string,
    text: (id: string) => string,
    setLang: StateUpdater<string>
}

export const LanguageContext = createContext<LanguageContext>({
    lang: 'en',
    text: id => "",
    setLang: () => {},
})
