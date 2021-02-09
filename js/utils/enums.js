import Enum from "https://cdn.skypack.dev/enum";

export const LoadingState = new Enum(["Loading", "Loaded", "Error"]);
export const LSState = new Enum([
	"LoadingWorker", 
	"SyncingDatabase",
	"DecompressingDatabase",
	"InitialisingSqlJs",
	"Loaded",
	"Error"
]);

export const SortOptions = new Enum([
	"Newest",
	"Oldest",
	"ArtistAToZ",
	"ArtistZToA",
	"SongAToZ",
	"SongZToA"
])