import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { photos } from "@/data/photos";

// 1. 静的パス生成（SSG）
export async function generateStaticParams() {
	return photos.map((photo) => ({ id: photo.id }));
}

// 2. generateMetadata の引数用の型定義をページコンポーネントと同じ形にする
// すなわち、params は Promise として定義する
interface MetadataProps {
	params: Promise<{
		id: string;
	}>;
}

// 2. 動的メタデータ生成（async 内で await で params を解決）
export async function generateMetadata({
	params,
}: MetadataProps): Promise<Metadata> {
	// 非同期で解決された params を待つ
	const { id } = await params;
	const photo = photos.find((p) => p.id === id);
	if (!photo) return {};

	return {
		title: photo.title,
		description: photo.comment,
		openGraph: {
			title: photo.title,
			description: photo.comment,
			images: [photo.highResUrl],
		},
		twitter: {
			card: "summary_large_image",
			title: photo.title,
			description: photo.comment,
			images: [photo.highResUrl],
		},
	};
}

// 3. ページ本体の型定義
interface PhotoDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function PhotoDetailPage({
	params,
}: PhotoDetailPageProps) {
	// 非同期で解決された params を待つ
	const { id } = await params;

	const photo = photos.find((p) => p.id === id);
	if (!photo) {
		notFound();
	}

	return (
		<main style={{ padding: "1rem" }}>
			<h1>{photo.title}</h1>
			<p>{photo.comment}</p>
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
