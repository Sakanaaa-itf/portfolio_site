import AlbumArtworkPage from "@/components/AlbumArtworkPage";

export const dynamic = "force-static";
export const revalidate = 1800;

export default function AlbumArtwork() {
	return <AlbumArtworkPage />;
}
