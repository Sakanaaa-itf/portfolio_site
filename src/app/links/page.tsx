import Links from "@/components/LinksPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata = createPageMetadata({
	description: "友人・知人のウェブサイトを紹介するリンク集です。",
	path: "/links/",
	title: "Links",
});

export default function LinksPage() {
	return <Links />;
}
