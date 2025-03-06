export interface PhotoMeta {
	id: string;
	lowResUrl: string;
	highResUrl: string;
	title?: string;
	comment: string;
	uploadedAt: string;
}

export const photos: PhotoMeta[] = [
	{
		id: "photo1",
		lowResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF0546.webp",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF0546.webp",
		title: "着陸前",
		comment: "地元への帰省のために飛行機に乗り、着陸直前に撮影。珊瑚礁が見えると地元って感じがします。",
		uploadedAt: "2023-09-02",
	},
	{
		id: "photo2",
		lowResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF0276.webp",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF0276.webp",
		title: "夏のはじまる前、散歩中に。",
		comment: "緑のトンネル。真ん中に被写体をおきたかった…",
		uploadedAt: "2023-08-25",
	},
	{
		id: "photo3",
		lowResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF7826.webp",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF7826.webp",
		title: "Dodge Charenger R/T 440 six pack",
		comment: "友人の車。アメ車の中では一番好き。",
		uploadedAt: "2023-09-06",
	},
	{
		id: "photo4",
		lowResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/_DSF7152.webp",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/_DSF7152.webp",
		title: "やどかり祭にて",
		comment: "逆光ってえっちですよね。",
		uploadedAt: "2023-09-07",
	},
	{
		id: "photo5",
		lowResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF0845.webp",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/DSCF0845.webp",
		title: "夏の終わりに。",
		comment: "地元の海沿いに生えている、アダンという木。",
		uploadedAt: "2023-09-10",
	},
	{
		id: "photo6",
		lowResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3.webp",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3.webp",
		title: "奄美大島にて",
		comment: "湾と市街を海側から見渡せる場所。",
		uploadedAt: "2023-09-14",
	},
	{
		id: "photo7",
		lowResUrl: "https://jtame.jp/wp-content/uploads/2024/09/s-8dBOYS-696x464.jpg",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/_DSF8740.webp",
		title: "UNIKP 2024 vol.10",
		comment: "大学対抗K-POPカバーダンス日本一決定戦” UNIKP “にて。BOYS部門優勝 京都産業大学 K21 BOYS\n オフィシャルカメラマンとして参加。\n https://jtame.jp/entertainment/139057/ に写真を掲載していただきました。",
		uploadedAt: "2024-09-17",
	},
	{
		id: "photo8",
		lowResUrl: "https://jtame.jp/wp-content/uploads/2024/09/78d895dced9f0af4670629ca542b2a46-640x426.jpg",
		highResUrl: "https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/_DSF7439.webp",
		title: "UNIKP 2024 vol.10",
		comment: "大学対抗K-POPカバーダンス日本一決定戦” UNIKP “にて。GIRLS部門優勝 中央大学 ZOK Girls\n オフィシャルカメラマンとして参加。\n https://jtame.jp/entertainment/139057/ に写真を掲載していただきました。",
		uploadedAt: "2024-09-17",
	}
];
