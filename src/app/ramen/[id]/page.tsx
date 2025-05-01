import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ramen } from "@/data/ramen";
import DetailView from "../../../components/RamenDetailPage";
import HamburgerMenu from "@/components/HamburgerMenu";

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
		metadataBase: new URL("https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c"),
		title: `${r.name} | ${r.shop}`,
		description: `${r.location} – ${r.name}`,
		openGraph: {
			url: `/ramen/${r.id}`,
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

export default async function RamenDetail({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
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
