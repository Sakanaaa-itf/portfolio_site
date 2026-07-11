import type { Metadata } from "next";

const DEFAULT_IMAGE = {
	alt: "ふわふわ.みんな",
	height: 630,
	url: "/og-image.webp",
	width: 1200,
} as const;

const SITE_NAME = "ふわふわ.みんな";

type PageMetadataOptions = {
	description: string;
	path: `/${string}`;
	title: string;
};

export function createPageMetadata({ description, path, title }: PageMetadataOptions): Metadata {
	const canonicalPath = path === "/" || path.endsWith("/") ? path : `${path}/`;

	return {
		alternates: { canonical: canonicalPath },
		description,
		openGraph: {
			description,
			images: [DEFAULT_IMAGE],
			locale: "ja_JP",
			siteName: SITE_NAME,
			title,
			type: "website",
			url: canonicalPath,
		},
		title,
		twitter: {
			card: "summary_large_image",
			creator: "@sakanaaa_photo",
			description,
			images: [DEFAULT_IMAGE.url],
			title,
		},
	};
}
