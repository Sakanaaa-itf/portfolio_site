import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { photos } from "@/data/photos";
import HamburgerMenu from "@/components/HamburgerMenu";

// 1. 静的パス生成（SSG）
export async function generateStaticParams() {
	return photos.map((photo) => ({ id: photo.id }));
}

// 2. generateMetadata の引数用の型定義（params は Promise として扱う）
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
		// metadataBase を設定することで、openGraph.url の相対パスが絶対 URL に解決されます
		metadataBase: new URL("https://xn--19ja1fb.xn--q9jyb4c"),
		title: photo.title,
		description: photo.comment,
		// ここで openGraph.url を設定することで、シェア時のリンク先を変更できます
		openGraph: {
			url: "/photoworks/",
			title: photo.title,
			description: photo.comment,
			images: [photo.lowResUrl],
		},
		twitter: {
			card: "summary_large_image",
			title: photo.title,
			description: photo.comment,
			images: [photo.lowResUrl],
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
