export interface PhotoMeta {
	id: string;
	lowResUrl: string;
	highResUrl: string;
	title: string;
	comment: string;
	uploadedAt: string;
}

const LOW_RES_PREFIX =
	"https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/%E3%82%8D%E3%83%BC%E3%82%8C%E3%81%9D%E3%82%99/";
const HIGH_RES_PREFIX =
	"https://xn--l8j8cqftsc.xn--19ja1fb.xn--q9jyb4c/%E3%81%AF%E3%81%84%E3%82%8C%E3%81%9D%E3%82%99/";

function isAbsolute(url: string): boolean {
	return /^https?:\/\//.test(url);
}

function addPrefixes(photos: Omit<PhotoMeta, "id">[]): PhotoMeta[] {
	return photos.map((photo, i) => ({
		id: String(i + 1),
		...photo,
		lowResUrl: isAbsolute(photo.lowResUrl)
			? photo.lowResUrl
			: LOW_RES_PREFIX + photo.lowResUrl,
		highResUrl: isAbsolute(photo.highResUrl)
			? photo.highResUrl
			: HIGH_RES_PREFIX + photo.highResUrl,
	}));
}

export const photos: PhotoMeta[] = addPrefixes([
	{
		lowResUrl: "DSCF0546_1600.webp",
		highResUrl: "DSCF0546_3200.jpg",
		title: "着陸前",
		comment:
			"地元への帰省のために飛行機に乗り、着陸直前に撮影。珊瑚礁が見えると地元って感じがします。",
		uploadedAt: "2023-09-02",
	},
	{
		lowResUrl: "DSCF0276_1600.webp",
		highResUrl: "DSCF0276_3200.jpg",
		title: "夏のはじまる前、散歩中に。",
		comment: "緑のトンネル。真ん中に被写体をおきたかった…",
		uploadedAt: "2023-08-25",
	},
	{
		lowResUrl: "DSCF7826_1600.webp",
		highResUrl: "DSCF7826_3200.jpg",
		title: "Dodge Charenger R/T 440 six pack",
		comment: "友人の車。アメ車の中では一番好き。",
		uploadedAt: "2023-12-14",
	},
	{
		lowResUrl: "_DSF7152_1600.webp",
		highResUrl: "_DSF7152_3200.jpg",
		title: "やどかり祭にて",
		comment: "逆光ってえっちですよね。",
		uploadedAt: "2024-05-31",
	},
	{
		lowResUrl: "DSCF0845_1600.webp",
		highResUrl: "DSCF0845_3200.jpg",
		title: "夏の終わりに。",
		comment: "地元の海沿いに生えている、アダンという木。",
		uploadedAt: "2023-09-10",
	},
	{
		lowResUrl:
			"E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3_1600.webp",
		highResUrl:
			"E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3_3200.jpg",
		title: "名瀬港",
		comment: "湾と市街を海側から見渡せる場所から撮影。",
		uploadedAt: "2023-09-14",
	},
	{
		lowResUrl: "https://jtame.jp/wp-content/uploads/2024/09/s-8dBOYS-696x464.jpg",
		highResUrl: "_DSF8740_3200.jpg",
		title: "MAESTRO",
		comment:
			"大学対抗K-POPカバーダンス日本一決定戦” UNIKP “ 2024 vol.10にて。BOYS部門優勝 京都産業大学 K21 BOYS\n オフィシャルカメラマンとして参加。\n https://jtame.jp/entertainment/139057/ に写真を掲載していただきました。",
		uploadedAt: "2024-09-17",
	},
	{
		lowResUrl:
			"https://jtame.jp/wp-content/uploads/2024/09/78d895dced9f0af4670629ca542b2a46-640x426.jpg",
		highResUrl: "_DSF7439_3200.jpg",
		title: "HELICOPTER",
		comment:
			"大学対抗K-POPカバーダンス日本一決定戦” UNIKP “ 2024 vol.10にて。GIRLS部門優勝 中央大学 ZOK Girls\n オフィシャルカメラマンとして参加。\n https://jtame.jp/entertainment/139057/ に写真を掲載していただきました。",
		uploadedAt: "2024-09-17",
	},
	{
		lowResUrl:
			"D081D1C8-C1BD-4F72-8504-0D498A495537-19829-000004ACF9D55EE1_1600.webp",
		highResUrl:
			"D081D1C8-C1BD-4F72-8504-0D498A495537-19829-000004ACF9D55EE1_3200.jpg",
		title: "実験中",
		comment: "実験中の様子。綺麗に撮れたけど地獄でした。",
		uploadedAt: "2023-07-19",
	},
	{
		lowResUrl:
			"7C4DF802-4D05-4B74-9F3A-BF617E09F0AE-52388-00001D904780C86C_1600.webp",
		highResUrl:
			"7C4DF802-4D05-4B74-9F3A-BF617E09F0AE-52388-00001D904780C86C_3200.jpg",
		title: "涸沼",
		comment:
			"大洗に行く途中にある涸沼駅にて。気動車が走っていて感動。フォントがいいなーなんて思っていたんですけど、名前はわかりません。",
		uploadedAt: "2024-01-27",
	},
	{
		lowResUrl: "DSCF0016_1600.webp",
		highResUrl: "DSCF0016_3200.jpg",
		title: "花火1",
		comment:
			"よくわからない河川敷にて。写っている手の人には長らく会っていません。元気なんすかね。",
		uploadedAt: "2023-08-12",
	},
	{
		lowResUrl: "DSCF0275_1600.webp",
		highResUrl: "DSCF0275_3200.jpg",
		title: "平面",
		comment:
			"自分はあまり撮影しない平面の写真。緑のトンネルをとった直後にこれを見つけて、撮影しました。",
		uploadedAt: "2023-08-25",
	},
	{
		lowResUrl: "DSCF0773%201_1600.webp",
		highResUrl: "DSCF0773%201_3200.jpg",
		title: "里の曙",
		comment:
			"帰省した時に飲んだ、黒糖焼酎。全然別の銘柄のグラスに注がれていますね。",
		uploadedAt: "2023-09-08",
	},
	{
		lowResUrl: "DSCF0813_1600.webp",
		highResUrl: "DSCF0813_3200.jpg",
		title: "花火2",
		comment: "地元では有名な場所である、通称三角浜にて。",
		uploadedAt: "2023-09-09",
	},
	{
		lowResUrl: "DSCF2790_1600.webp",
		highResUrl: "DSCF2790_3200.jpg",
		title: "鉄塔と星",
		comment:
			"星空の下、鉄塔を撮影。長秒露光して星だけを動かした。車のハザードを焚きながら待っていたら、故障車だと思われて警察に声をかけられてしまった。",
		uploadedAt: "2023-10-22",
	},
	{
		lowResUrl: "DSCF8063_1600.webp",
		highResUrl: "DSCF8063_3200.jpg",
		title: "海と友人と",
		comment:
			"カメラを買って初めて人物を主題に撮影した写真。誘ってくれた友人とモデルになってくれた友人に感謝。",
		uploadedAt: "2023-07-06",
	},
	{
		lowResUrl: "DSCF8674_1600.webp",
		highResUrl: "DSCF8674_3200.jpg",
		title: "流しマカロニ",
		comment:
			"筑波大学内にある石の広場にて、友人が企画してくれた流しそうめん。流すものがなくなって、自分が到着したころには流しマカロニになっていました。",
		uploadedAt: "2023-07-12",
	},
	{
		lowResUrl: "DSCF9639_1600.webp",
		highResUrl: "DSCF9639_3200.jpg",
		title: "now on stage",
		comment:
			"成人式のため帰省した時のライブハウスにて。友人達のバンドが出演していたので、それを撮影。カッコ良すぎる。",
		uploadedAt: "2024-01-05",
	},
	{
		lowResUrl:
			"https://pbs.twimg.com/media/Gmzg-ceb0AAYCza?format=jpg&name=large",
		highResUrl: "_DSF5447NR_3200.jpg",
		title: "もし明日が来ないとしたら",
		comment:
			"UNIDOL 2024-25 Winter 決勝戦にて。\n Xにて演者様に掲載していただけました。 \n https://t.co/wZdm482G13",
		uploadedAt: "2025-02-26",
	},
	{
		lowResUrl: "_DSF0382-強化-NR_1600.webp",
		highResUrl: "_DSF0382-強化-NR_3200.jpg",
		title: "呪って呪って",
		comment:
			"Bombs!4th単独公演 4ever〜ぼむずと紡ぐ∞の物語〜にて。オフィシャルカメラマンとして参加。 \n目のハイライトの入り方、好きです。",
		uploadedAt: "2025-03-14",
	},
	{
		lowResUrl: "_DSF0766-強化-NR_1600.webp",
		highResUrl: "_DSF0766-強化-NR_3200.jpg",
		title: "ぼくらのうた",
		comment:
			"Bombs!4th単独公演 4ever〜ぼむずと紡ぐ∞の物語〜にて。オフィシャルカメラマンとして参加。 \n卒業代の先輩方を撮影させていただきました。",
		uploadedAt: "2025-03-14",
	},
	{
		lowResUrl: "IMG_6408_1600.webp",
		highResUrl: "IMG_6408_3200.jpg",
		title: "お見送り",
		comment: "高校卒業後、島を出ていく友人のお見送り。",
		uploadedAt: "2022-03-06",
	},
	{
		lowResUrl: "IMG_2991_1600.webp",
		highResUrl: "IMG_2991_3200.jpg",
		title: "筑波山",
		comment: "筑波山の朝日峠から、日の出を撮影。",
		uploadedAt: "2022-12-14",
	},
	{
		lowResUrl: "IMG_2173_1600.webp",
		highResUrl: "IMG_2173_3200.jpg",
		title: "高校、放課後",
		comment:
			"下でラグビー部だったかが騒いでいたのをのぞいている図。\n めちゃ恋人風に見えますよね、そんなことないです。",
		uploadedAt: "2020-09-03",
	},
	{
		lowResUrl: "_DSF0958_1600.webp",
		highResUrl: "_DSF0958_3200.jpg",
		title: "Sing Out!",
		comment:
			"UNIDOL 2024 Summer 決勝戦にて。準優勝 明治大学・chocolat lumière\n オフィシャルカメラマンとして参加。",
		uploadedAt: "2024-08-27",
	},
	{
		lowResUrl: "_DSF0869-Enhanced-NR_1600.webp",
		highResUrl: "_DSF0869-Enhanced-NR_3200.jpg",
		title: "Panorama",
		comment:
			"Bombs!3rd単独「Blooming 〜Bombs! 5th Anniversary〜」にて。オフィシャルカメラマンとして参加。",
		uploadedAt: "2024-03-08",
	},
	{
		lowResUrl: "_DSF1599_1600.webp",
		highResUrl: "_DSF1599_3200.jpg",
		title: "秋",
		comment:
			"地元ではこんな綺麗に紅葉しない。たまたまいた通行人がすごくよく写ってくれた一枚。",
		uploadedAt: "2024-11-17",
	},
	{
		lowResUrl: "_DSF1639_1600.webp",
		highResUrl: "_DSF1639_3200.jpg",
		title: "銀杏",
		comment: "光盛れしすぎている銀杏の葉。",
		uploadedAt: "2024-11-18",
	},
	{
		lowResUrl: "_DSF2079_1600.webp",
		highResUrl: "_DSF2079_3200.jpg",
		title: "3A501",
		comment: "学内を探検していた時に発見した教室。",
		uploadedAt: "2024-10-02",
	},
	{
		lowResUrl: "_DSF2889_1600.webp",
		highResUrl: "_DSF2889_3200.jpg",
		title: "ひなたうた",
		comment:
			"Doo-Wop夏ライブ2024にて。\n オフィシャルカメラマンとして参加。\n ナナニッパのデビュー戦でした。",
		uploadedAt: "2024-09-15",
	},
	{
		lowResUrl: "_DSF7342_1600.webp",
		highResUrl: "_DSF7342_3200.jpg",
		title: "桜",
		comment: "緋寒桜以外の桜って珍しい。地元にないし。",
		uploadedAt: "2025-04-05",
	},
	{
		lowResUrl: "_DSF2370_1600.webp",
		highResUrl: "_DSF2370_3200.jpg",
		title: "Spring day",
		comment:
			"コグマ 2025 卒ライ「約束」にて。\n オフィシャルカメラマンとして参加。\n",
		uploadedAt: "2025-03-19",
	},
	{
		lowResUrl: "Z91_0301_1600.webp",
		highResUrl: "Z91_0301_3200.jpg",
		title: "Bad girl Good girl",
		comment:
			"コグマ 2025 卒ライ「約束」にて。\n オフィシャルカメラマンとして参加。\n",
		uploadedAt: "2025-03-19",
	},
]);
