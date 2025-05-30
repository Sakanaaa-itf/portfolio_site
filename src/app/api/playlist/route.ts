import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 1800;

interface YouTubePlaylistItem {
	snippet: {
		resourceId: { videoId: string };
		thumbnails: {
			default?: { url: string };
			high?: { url: string };
			maxres?: { url: string };
			medium?: { url: string };
			standard?: { url: string };
		};
		title: string;
	};
}

interface PlaylistPage {
	items: YouTubePlaylistItem[];
	nextPageToken?: string;
}

export async function GET() {
	const API_KEY = process.env.YOUTUBE_API_KEY!;
	const PLAYLIST_ID = process.env.PLAYLIST_ID!;
	if (!API_KEY || !PLAYLIST_ID) {
		return NextResponse.json({ error: ".env.localが設定されていません" }, { status: 500 });
	}

	const baseUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
	let allItems: YouTubePlaylistItem[] = [];
	let nextPageToken: string | undefined = undefined;

	do {
		const url = new URL(baseUrl);
		url.searchParams.set("part", "snippet");
		url.searchParams.set("playlistId", PLAYLIST_ID);
		url.searchParams.set("maxResults", "50");
		if (nextPageToken) url.searchParams.set("pageToken", nextPageToken);
		url.searchParams.set("key", API_KEY);

		const res = await fetch(url.toString());
		if (!res.ok) {
			const err = await res.text();
			return NextResponse.json({ error: err, tracks: [] }, { status: res.status });
		}

		const page = (await res.json()) as PlaylistPage;
		allItems = allItems.concat(page.items || []);
		nextPageToken = page.nextPageToken;
	} while (nextPageToken);

	const tracks = allItems.map((it) => {
		const t = it.snippet.thumbnails ?? {};
		const art =
			t.maxres?.url ?? t.high?.url ?? t.medium?.url ?? t.standard?.url ?? t.default?.url ?? "";

		return {
			art,
			id: it.snippet.resourceId.videoId,
			title: it.snippet.title,
		};
	});

	return NextResponse.json({ tracks });
}
