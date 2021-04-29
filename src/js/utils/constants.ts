export const API_URL = 'https://api.rhythm.cafe/orchard.json';

export enum LoadingState {
    Loading,
    Loaded,
    Error
};

export enum SortOptions {
    newest = 'newest',
    oldest = 'oldest',
    artistaz = 'artistaz',
    artistza = 'artistza',
    songaz = 'songaz',
    songza = 'songza'
}