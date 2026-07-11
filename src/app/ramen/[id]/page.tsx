import { notFound } from "next/navigation";

import HamburgerMenu from "@/components/HamburgerMenu";
import DetailView from "@/components/RamenDetailPage";
import { ramen } from "@/data/ramen";

import type { Metadata } from "next";

const SITE_URL = new URL("https://xn--19ja1fb.xn--q9jyb4c/");

export const dynamicParams = false;

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
	const description = `${r.location} — ${r.name}`;
	const title = `${r.name} | ${r.shop}`;
	const visitedDate = r.date.trim();
	const publishedAt = new Date(`${visitedDate}T00:00:00+09:00`);
	const publishedTime = Number.isNaN(publishedAt.getTime()) ? undefined : publishedAt.toISOString();

	return {
		alternates: { canonical: `/ramen/${r.id}/` },
		description,
		metadataBase: SITE_URL,
		openGraph: {
			description,
			images: [{ alt: `${r.shop}の${r.name}`, url: r.highResUrl }],
			publishedTime,
			siteName: "ふわふわ.みんな",
			title,
			type: "article",
			url: `/ramen/${r.id}/`,
		},
		title,
		twitter: {
			card: "summary_large_image",
			description,
			images: [r.highResUrl],
			title,
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
