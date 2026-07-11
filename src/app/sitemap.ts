import { photos } from "@/data/photos";
import { ramen } from "@/data/ramen";

import type { MetadataRoute } from "next";

const baseUrl = "https://xn--19ja1fb.xn--q9jyb4c";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes: MetadataRoute.Sitemap = [
		{ changeFrequency: "monthly", priority: 1, url: `${baseUrl}/` },
		{ changeFrequency: "monthly", priority: 0.9, url: `${baseUrl}/photoworks/` },
		{ changeFrequency: "monthly", priority: 0.8, url: `${baseUrl}/ramen/` },
		{ changeFrequency: "monthly", priority: 0.7, url: `${baseUrl}/albumartwork/` },
		{ changeFrequency: "yearly", priority: 0.5, url: `${baseUrl}/links/` },
	];

	const photoRoutes: MetadataRoute.Sitemap = photos.map((photo) => ({
		lastModified: new Date(photo.date),
		priority: 0.7,
		url: `${baseUrl}/photoworks/${photo.id}/`,
	}));
	const ramenRoutes: MetadataRoute.Sitemap = ramen.map((item) => ({
		lastModified: new Date(item.date),
		priority: 0.6,
		url: `${baseUrl}/ramen/${item.id}/`,
	}));

	return [...staticRoutes, ...photoRoutes, ...ramenRoutes];
}
