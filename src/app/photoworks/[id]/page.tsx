// src/app/photoworks/[id]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { photos } from "@/data/photos";

/**
 * 1) 静的パラメータを生成 (SSG のため)
 *    getStaticPaths 相当の機能
 */
export async function generateStaticParams() {
	return photos.map((photo) => ({
		id: photo.id,
	}));
}

/**
 * 2) メタデータ (OGP/Twitter Card) を動的生成
 *    Next.js App Routerでは、引数に { params, searchParams }, 第二引数に "ResolvingMetadata" が入る
 */
export async function generateMetadata(
	{ params }: { params: { id: string } }
): Promise<Metadata> {
	const photo = photos.find((p) => p.id === params.id);
	if (!photo) {
		// 存在しないIDならメタデータは空
		return {};
	}

	const title = photo.title || "Photo";
	const description = photo.comment || "A nice photo.";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [photo.highResUrl],
			type: "article",
			// url: `https://xn--19ja1fb.xn--q9jyb4c/photoworks/${photo.id}`
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [photo.highResUrl],
		},
	};
}

/**
 * 3) ページコンポーネント
 *    - Next.js App Routerでは、(props: { params: { ... }, searchParams?: ... }) という形が推奨
 */
export default function PhotoDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const photo = photos.find((p) => p.id === params.id);
	if (!photo) {
		// 404ページへ
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
