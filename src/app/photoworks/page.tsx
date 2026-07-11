import PhotoWorks from "@/components/PhotoworksPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
	description: "岡 海摩が撮影した写真作品の一覧です。",
	path: "/photoworks/",
	title: "Photoworks",
});

export default function PhotoworksPage() {
	return <PhotoWorks />;
}
