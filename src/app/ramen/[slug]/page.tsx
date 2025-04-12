import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ramen } from "@/data/ramen";
import DetailView from "./DetailView";
import HamburgerMenu from "@/components/HamburgerMenu";

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

export function generateStaticParams() {
	return ramen.map((r) => ({
		slug: slugify(`${r.shop}-${r.name}-${r.date}`),
	}));
}

interface MetaProps {
	params: Promise<{ slug: string }>;
}
export async function generateMetadata({
	params,
}: MetaProps): Promise<Metadata> {
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

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function RamenDetail({ params }: PageProps) {
	const { slug } = await params;
	const r = ramen.find((x) => slugify(`${x.shop}-${x.name}-${x.date}`) === slug);
	if (!r) notFound();

	return (
		<>
			<HamburgerMenu />
			<DetailView ramen={r} />
		</>
	);
}
