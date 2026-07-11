export interface MusicTrack {
	art: string;
	id: string;
	title: string;
}

export interface MusicPlaylistResult {
	message?: string;
	status: "empty" | "error" | "ready" | "unconfigured";
	tracks: MusicTrack[];
}
