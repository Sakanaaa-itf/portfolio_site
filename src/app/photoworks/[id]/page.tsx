// src/app/photoworks/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { photos } from "@/data/photos";

type PhotoDetailPageProps = {
	params: { id: string }; // [id] から取得されるパラメータ
};

// 静的パラメータ生成 (ビルド時に全写真のページを作る)
export async function generateStaticParams() {
	return photos.map((photo) => ({
		id: photo.id,
	}));
}

// 動的メタデータ生成 (OGP/Twitter Card 用)
export async function generateMetadata({ params }: PhotoDetailPageProps) {
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
			// url: `https://xn--19ja1fb.xn--q9jyb4c/photoworks/${photo.id}`, // 必要なら指定
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [photo.highResUrl],
		},
	};
}

// 実際のページコンポーネント
export default function PhotoDetailPage({ params }: PhotoDetailPageProps) {
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
