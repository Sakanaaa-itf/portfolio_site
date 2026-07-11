import type { MusicPlaylistResult, MusicTrack } from "@/types/music";

interface YouTubePlaylistItem {
	snippet?: {
		resourceId?: { videoId?: string };
		thumbnails?: YouTubeThumbnails;
		title?: string;
	};
}

interface YouTubePlaylistPage {
	items?: YouTubePlaylistItem[];
	nextPageToken?: string;
}

interface YouTubeThumbnail {
	url?: string;
}

interface YouTubeThumbnails {
	default?: YouTubeThumbnail;
	high?: YouTubeThumbnail;
	maxres?: YouTubeThumbnail;
	medium?: YouTubeThumbnail;
	standard?: YouTubeThumbnail;
}

const PLAYLIST_ITEMS_ENDPOINT = "https://www.googleapis.com/youtube/v3/playlistItems";

function toMusicTrack(item: YouTubePlaylistItem): MusicTrack | null {
	const { snippet } = item;
	const id = snippet?.resourceId?.videoId?.trim();
	const title = snippet?.title?.trim();
	const thumbnails = snippet?.thumbnails;
	const art =
		thumbnails?.maxres?.url ??
		thumbnails?.standard?.url ??
		thumbnails?.high?.url ??
		thumbnails?.medium?.url ??
		thumbnails?.default?.url;

	if (!art || !id || !title) return null;

	return { art, id, title };
}

/**
 * Fetches the playlist while Next.js is generating the static page. Failures are
 * represented as data so a temporary YouTube outage never prevents deployment.
 */
export async function getYouTubePlaylist(): Promise<MusicPlaylistResult> {
	const apiKey = process.env.YOUTUBE_API_KEY?.trim();
	const playlistId = process.env.PLAYLIST_ID?.trim();

	if (!apiKey || !playlistId) {
		return {
			message: "YouTubeプレイリストは現在設定されていません。",
			status: "unconfigured",
			tracks: [],
		};
	}

	try {
		const pageTokens = new Set<string>();
		const tracks = new Map<string, MusicTrack>();
		let nextPageToken: string | undefined;

		do {
			const url = new URL(PLAYLIST_ITEMS_ENDPOINT);
			url.searchParams.set("part", "snippet");
			url.searchParams.set("playlistId", playlistId);
			url.searchParams.set("maxResults", "50");
			url.searchParams.set("key", apiKey);
			if (nextPageToken) url.searchParams.set("pageToken", nextPageToken);

			const response = await fetch(url, {
				cache: "force-cache",
				signal: AbortSignal.timeout(15_000),
			});
			if (!response.ok) throw new Error(`YouTube API returned ${response.status}`);

			const page = (await response.json()) as YouTubePlaylistPage;
			for (const item of page.items ?? []) {
				const track = toMusicTrack(item);
				if (track) tracks.set(track.id, track);
			}
			const returnedPageToken = page.nextPageToken?.trim();
			if (returnedPageToken && pageTokens.has(returnedPageToken)) {
				throw new Error("YouTube API returned a repeated page token");
			}
			if (returnedPageToken) pageTokens.add(returnedPageToken);
			nextPageToken = returnedPageToken;
		} while (nextPageToken);

		const playlistTracks = [...tracks.values()];
		if (playlistTracks.length === 0) {
			return {
				message: "プレイリストに表示できる動画がありません。",
				status: "empty",
				tracks: [],
			};
		}

		return { status: "ready", tracks: playlistTracks };
	} catch {
		return {
			message: "YouTubeプレイリストを取得できませんでした。時間をおいて再度お試しください。",
			status: "error",
			tracks: [],
		};
	}
}
