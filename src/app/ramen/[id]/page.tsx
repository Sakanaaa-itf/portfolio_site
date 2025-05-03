import { notFound } from "next/navigation";

import HamburgerMenu from "@/components/HamburgerMenu";
import DetailView from "@/components/RamenDetailPage";
import { ramen } from "@/data/ramen";

import type { Metadata } from "next";

export function generateStaticParams() {
	return ramen.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const r = ramen.find((x) => x.id === id);
	if (!r) return {};

	return {
		description: `${r.location} – ${r.name}`,
		metadataBase: new URL("https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c"),
		openGraph: {
			description: `${r.location} – ${r.name}`,
			images: [r.highResUrl],
			siteName: "ふわふわ.みんな",
			title: `${r.name} | ${r.shop}`,
			type: "article",
			url: `/ramen/${r.id}`,
		},
		title: `${r.name} | ${r.shop}`,
		twitter: {
			card: "summary_large_image",
			description: `${r.location} – ${r.name}`,
			images: [r.highResUrl],
			title: `${r.name} | ${r.shop}`,
		},
	};
}

export default async function RamenDetail({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const r = ramen.find((x) => x.id === id);
	if (!r) notFound();

	return (
		<>
			<HamburgerMenu />
			<DetailView ramen={r} />
		</>
	);
}
