import { notFound } from "next/navigation";

import PhotoDetailPage from "@/components/PhotoDetailPage";
import { photos } from "@/data/photos";

import type { Metadata } from "next";

export async function generateStaticParams() {
	return photos.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const photo = photos.find((p) => p.id === id);
	if (!photo) return {};

	return {
		description: photo.comment,
		metadataBase: new URL("https://xn--19ja1fb.xn--q9jyb4c"),
		openGraph: {
			description: photo.comment,
			images: [photo.lowResUrl],
			siteName: "ふわふわ.みんな",
			title: photo.title,
			type: "website",
			url: `/photoworks/${photo.id}`,
		},
		title: photo.title,
		twitter: {
			card: "summary_large_image",
			description: photo.comment,
			site: "@sakanaaa_photo",
			title: photo.title,
		},
	};
}

export default async function PhotoworksDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const photoIndex = photos.findIndex((p) => p.id === id);
	if (photoIndex === -1) notFound();

	const photo = photos[photoIndex];
	const prevPhoto = photos[photoIndex - 1] ?? null;
	const nextPhoto = photos[photoIndex + 1] ?? null;

	return <PhotoDetailPage nextPhoto={nextPhoto} photo={photo} prevPhoto={prevPhoto} />;
}
