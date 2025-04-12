export interface RamenMeta {
	lowResUrl: string;
	highResUrl: string;
	shop: string;
	location: string;
	name: string;
	date: string;
}

const LOW_RES_PREFIX =
	"https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E3%82%8D%E3%83%BC/";
const HIGH_RES_PREFIX =
	"https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E3%81%AF%E3%81%84/";

function addPrefixes(photos: RamenMeta[]): RamenMeta[] {
	return photos.map((photo) => ({
		...photo,
		lowResUrl: LOW_RES_PREFIX + photo.lowResUrl,
		highResUrl: HIGH_RES_PREFIX + photo.highResUrl,
	}));
}

export const ramen: RamenMeta[] = addPrefixes([
	{
		lowResUrl: "IMG_3588_400.webp",
		highResUrl: "IMG_3588_1600.webp",
		shop: "特級鶏蕎麦 龍介",
		location: "茨城県土浦市永国７７８",
		name: "まぜそば",
		date: "2025-01-03",
	},
]);
