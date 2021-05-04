import { SortOptions } from "./constants";

export type sourceId =
    "rdl" |
    "workshop" |
    "yeoldesheet"

export type Level = {
    thumb: string,
    icon: string | null,
    hue: number,
    artist: string,
    song: string,
    author: string,
    difficulty: number,
    description: string,
    approval: number,
    approval_message: string | null,
    authors: Array<string>,
    uploaded: number,
    max_bpm: number,
    min_bpm: number,
    source_id: sourceId,
    source_iid: string,
    url: string | null,
    url2: string,
    seizure_warning: boolean,
    has_classics: boolean,
    has_oneshots: boolean,
    has_squareshots: boolean,
    has_swing: boolean,
    has_freetimes: boolean,
    has_holds: boolean,
    single_player: boolean,
    two_player: boolean,
    tags: Array<string>
}

export type QueryParams = {
    q: string;
    limit: number;
    page: number;
    show_x: boolean;
    sort: SortOptions;
}

export type RouteFunction = (path: string, search: Record<string, string>, useCurrent: boolean) => void;
