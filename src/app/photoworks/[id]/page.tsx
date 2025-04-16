import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { photos } from "@/data/photos";
import HamburgerMenu from "@/components/HamburgerMenu";

export async function generateStaticParams() {
	return photos.map((photo) => ({ id: photo.id }));
}

interface MetadataProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: MetadataProps): Promise<Metadata> {
	const { id } = await params;
	const photo = photos.find((p) => p.id === id);
	if (!photo) return {};

	return {
		metadataBase: new URL("https://xn--19ja1fb.xn--q9jyb4c"),
		title: photo.title,
		description: photo.comment,
		openGraph: {
			url: "/photoworks/",
			title: photo.title,
			description: photo.comment,
			type: "website",
			siteName: "ふわふわ.みんな",
			images: [photo.highResUrl],
		},
		twitter: {
			card: "summary_large_image",
			title: photo.title,
			description: photo.comment,
			site: "@sakanaaa_photo",
		},
	};
}

interface PhotoDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function PhotoDetailPage({
	params,
}: PhotoDetailPageProps) {
	const { id } = await params;

	const photo = photos.find((p) => p.id === id);
	if (!photo) {
		notFound();
	}

	return (
		<main style={{ padding: "1rem", display: "grid", justifyContent: "center" }}>
			<HamburgerMenu />
			<h1 style={{ padding: "1rem", fontSize: "24px" }}>{photo.title}</h1>
			<Image
				src={photo.lowResUrl}
				alt={photo.title}
				width={800}
				height={600}
				style={{ maxWidth: "100%", height: "auto" }}
			/>
		</main>
	);
}
