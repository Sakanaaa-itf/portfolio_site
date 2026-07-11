import AlbumArtworkPage from "@/components/AlbumArtworkPage";
import { createPageMetadata } from "@/lib/pageMetadata";
import { getYouTubePlaylist } from "@/lib/youtubePlaylist";

export const dynamic = "force-static";

export const metadata = createPageMetadata({
	description: "お気に入りの音楽をYouTubeプレイリストから紹介しています。",
	path: "/albumartwork/",
	title: "Favorite Music",
});

export default async function AlbumArtwork() {
	const playlist = await getYouTubePlaylist();

	return <AlbumArtworkPage playlist={playlist} />;
}
