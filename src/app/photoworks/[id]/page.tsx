import { notFound } from "next/navigation";

import PhotoDetailPage from "@/components/PhotoDetailPage";
import { photos } from "@/data/photos";
import { sortByDate } from "@/utils/sort";

import type { Metadata } from "next";

const SITE_URL = "https://xn--19ja1fb.xn--q9jyb4c";
const sortedPhotos = [...photos].sort(sortByDate);

export const dynamicParams = false;

type PageProps = {
	params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
	return sortedPhotos.map((photo) => ({ id: photo.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { id } = await params;
	const photo = sortedPhotos.find((candidate) => candidate.id === id);
	if (!photo) return {};

	return {
		alternates: {
			canonical: `/photoworks/${photo.id}/`,
		},
		description: photo.comment,
		metadataBase: new URL(SITE_URL),
		openGraph: {
			description: photo.comment,
			images: [photo.lowResUrl],
			siteName: "ふわふわ.みんな",
			title: photo.title,
			type: "website",
			url: `/photoworks/${photo.id}/`,
		},
		title: photo.title,
		twitter: {
			card: "summary_large_image",
			description: photo.comment,
			images: [photo.lowResUrl],
			site: "@sakanaaa_photo",
			title: photo.title,
		},
	};
}

export default async function PhotoworksDetailPage({ params }: PageProps) {
	const { id } = await params;

	const photoIndex = sortedPhotos.findIndex((photo) => photo.id === id);
	if (photoIndex === -1) notFound();

	const photo = sortedPhotos[photoIndex];
	if (!photo) notFound();

	const prevPhoto = sortedPhotos[photoIndex - 1] ?? null;
	const nextPhoto = sortedPhotos[photoIndex + 1] ?? null;

	return <PhotoDetailPage nextPhoto={nextPhoto} photo={photo} prevPhoto={prevPhoto} />;
}
