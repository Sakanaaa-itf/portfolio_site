// src/app/api/playlist/route.ts
export const runtime = "nodejs"; // ← fetch で env を読むなら nodejs に
export const revalidate = 1800;

interface YouTubePlaylistItem {
	snippet: {
		title: string;
		thumbnails: {
			default?: { url: string };
			medium?: { url: string };
			high?: { url: string };
			standard?: { url: string };
			maxres?: { url: string };
		};
		resourceId: { videoId: string };
	};
}

interface PlaylistItemsResponse {
	items: YouTubePlaylistItem[];
}

export async function GET() {
	const API_KEY = process.env.YOUTUBE_API_KEY!;
	const PLAYLIST_ID = process.env.PLAYLIST_ID!;

	if (!API_KEY || !PLAYLIST_ID) {
		return Response.json(
			{ error: ".env.local が設定されていません" },
			{ status: 500 }
		);
	}

	const url =
		`https://www.googleapis.com/youtube/v3/playlistItems` +
		`?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}` +
		`&key=${API_KEY}`;

	const res = await fetch(url);
	if (!res.ok) {
		return Response.json(
			{ tracks: [], error: await res.text() }, // ← tracks: [] を返す
			{ status: res.status }
		);
	}

	const { items } = (await res.json()) as PlaylistItemsResponse;

	const tracks = items.map((it) => {
		const t = it.snippet.thumbnails;
		const art = (t.maxres ?? t.high ?? t.medium ?? t.default)!.url;
		return {
			id: it.snippet.resourceId.videoId,
			title: it.snippet.title,
			art,
		};
	});

	return Response.json({ tracks });
}
