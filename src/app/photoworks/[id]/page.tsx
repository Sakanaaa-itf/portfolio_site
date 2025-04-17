import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PhotoDetailPage from "@/components/PhotoDetailPage";
import { photos } from "@/data/photos";

/* --- SSG --- */
export async function generateStaticParams() {
	return photos.map((p) => ({ id: p.id }));
}

/* --- Metadata --- */
export async function generateMetadata({
	params,
}: {
	params: { id: string };
}): Promise<Metadata> {
	const photo = photos.find((p) => p.id === params.id);
	if (!photo) return {};

	return {
		metadataBase: new URL("https://xn--19ja1fb.xn--q9jyb4c"),
		title: photo.title,
		description: photo.comment,
		openGraph: {
			url: `/photoworks/${photo.id}`,
			title: photo.title,
			description: photo.comment,
			type: "website",
			siteName: "ふわふわ.みんな",
			images: [photo.lowResUrl],
		},
		twitter: {
			card: "summary_large_image",
			title: photo.title,
			description: photo.comment,
			site: "@sakanaaa_photo",
		},
	};
}

/* --- ページ本体 (Server Component) --- */
export default function PhotoworksDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const photoIndex = photos.findIndex((p) => p.id === params.id);
	if (photoIndex === -1) notFound(); // ← ★ ここで判定

	const photo = photos[photoIndex];
	const prev = photos[photoIndex - 1] ?? null; // 左右ナビ用
	const next = photos[photoIndex + 1] ?? null;

	return (
		<PhotoDetailPage /* Client 側へ渡すデータ */
			photo={photo}
			prevPhoto={prev}
			nextPhoto={next}
		/>
	);
}
