// src/app/photoworks/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { photos } from "@/data/photos";

// 1) 静的パラメータを生成
export async function generateStaticParams() {
	return photos.map((photo) => ({ id: photo.id }));
}

// 2) 動的メタデータ (OGP/Twitter Card)
export async function generateMetadata({ params }: { params: { id: string } }) {
	const photo = photos.find((p) => p.id === params.id);
	if (!photo) {
		return {};
	}

	const title = photo.title ?? "Photo";
	const description = photo.comment ?? "A nice photo.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [photo.highResUrl],
			type: "article",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [photo.highResUrl],
		},
	};
}

// 3) ページコンポーネント
export default function PhotoDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const photo = photos.find((p) => p.id === params.id);
	if (!photo) {
		notFound();
	}

	return (
		<main style={{ padding: "1rem" }}>
			<h1>{photo?.title}</h1>
			<p>{photo?.comment}</p>
			<Image
				src={photo?.highResUrl ?? ""}
				alt={photo?.title ?? ""}
				width={800}
				height={600}
				style={{ maxWidth: "100%", height: "auto" }}
			/>
		</main>
	);
}
