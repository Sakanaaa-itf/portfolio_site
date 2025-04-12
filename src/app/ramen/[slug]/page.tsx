import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ramen, RamenMeta } from "@/data/ramen";
import DetailView from "./DetailView";

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

// ---------- 静的パス ----------
export function generateStaticParams() {
	return ramen.map((r) => ({
		slug: slugify(`${r.shop}-${r.name}-${r.date}`),
	}));
}

// ---------- 動的メタデータ ----------
interface MetadataProps {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({
	params,
}: MetadataProps): Promise<Metadata> {
	const { slug } = await params;
	const r = ramen.find((x) => slugify(`${x.shop}-${x.name}-${x.date}`) === slug);
	if (!r) return {};
	return {
		metadataBase: new URL("https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c"),
		title: `${r.name} | ${r.shop}`,
		description: `${r.location} – ${r.name}`,
		openGraph: {
			url: `/ramen/${slug}`,
			type: "article",
			siteName: "ふわふわ.みんな",
			title: `${r.name} | ${r.shop}`,
			description: `${r.location} – ${r.name}`,
			images: [r.highResUrl],
		},
		twitter: {
			card: "summary_large_image",
			title: `${r.name} | ${r.shop}`,
			description: `${r.location} – ${r.name}`,
			images: [r.highResUrl],
		},
	};
}

// ---------- ページ本体 ----------
interface PageProps {
	params: { slug: string };
}

export default function RamenDetail({ params }: PageProps) {
	const r = ramen.find(
		(x) => slugify(`${x.shop}-${x.name}-${x.date}`) === params.slug
	);
	if (!r) notFound();

	return <DetailView ramen={r as RamenMeta} />;
}
