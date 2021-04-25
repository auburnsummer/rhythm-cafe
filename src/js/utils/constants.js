import Enum from 'enum';

export const API_URL = 'https://api.rhythm.cafe/orchard.json';

export const LoadingState = new Enum(['Loading', 'Loaded', 'Error']);

export const SortOptions = new Enum([
    'Newest',
    'Oldest',
    'ArtistAToZ',
    'ArtistZToA',
    'SongAToZ',
    'SongZToA',
]);
