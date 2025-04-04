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

function addPrefixes(photos: PhotoMeta[]): PhotoMeta[] {
	return photos.map((photo) => ({
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
		id: "photo1",
		lowResUrl: "DSCF0546_low.jpg",
		highResUrl: "DSCF0546.webp",
		title: "着陸前",
		comment:
			"地元への帰省のために飛行機に乗り、着陸直前に撮影。珊瑚礁が見えると地元って感じがします。",
		uploadedAt: "2023-09-02",
	},
	{
		id: "photo2",
		lowResUrl: "DSCF0276_low.jpg",
		highResUrl: "DSCF0276.webp",
		title: "夏のはじまる前、散歩中に。",
		comment: "緑のトンネル。真ん中に被写体をおきたかった…",
		uploadedAt: "2023-08-25",
	},
	{
		id: "photo3",
		lowResUrl: "DSCF7826_low.jpg",
		highResUrl: "DSCF7826.webp",
		title: "Dodge Charenger R/T 440 six pack",
		comment: "友人の車。アメ車の中では一番好き。",
		uploadedAt: "2023-09-06",
	},
	{
		id: "photo4",
		lowResUrl: "_DSF7152_low.jpg",
		highResUrl: "_DSF7152.webp",
		title: "やどかり祭にて",
		comment: "逆光ってえっちですよね。",
		uploadedAt: "2023-09-07",
	},
	{
		id: "photo5",
		lowResUrl: "DSCF0845_low.jpg",
		highResUrl: "DSCF0845.webp",
		title: "夏の終わりに。",
		comment: "地元の海沿いに生えている、アダンという木。",
		uploadedAt: "2023-09-10",
	},
	{
		id: "photo6",
		lowResUrl:
			"E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3_low.jpg",
		highResUrl: "E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3.webp",
		title: "名瀬港",
		comment: "湾と市街を海側から見渡せる場所から撮影。",
		uploadedAt: "2023-09-14",
	},
	{
		id: "photo7",
		lowResUrl: "https://jtame.jp/wp-content/uploads/2024/09/s-8dBOYS-696x464.jpg",
		highResUrl: "DSCF8740.webp",
		title: "UNIKP 2024 vol.10",
		comment:
			"大学対抗K-POPカバーダンス日本一決定戦” UNIKP “にて。BOYS部門優勝 京都産業大学 K21 BOYS\n オフィシャルカメラマンとして参加。\n https://jtame.jp/entertainment/139057/ に写真を掲載していただきました。",
		uploadedAt: "2024-09-17",
	},
	{
		id: "photo8",
		lowResUrl:
			"https://jtame.jp/wp-content/uploads/2024/09/78d895dced9f0af4670629ca542b2a46-640x426.jpg",
		highResUrl: "DSCF7439.webp",
		title: "UNIKP 2024 vol.10",
		comment:
			"大学対抗K-POPカバーダンス日本一決定戦” UNIKP “にて。GIRLS部門優勝 中央大学 ZOK Girls\n オフィシャルカメラマンとして参加。\n https://jtame.jp/entertainment/139057/ に写真を掲載していただきました。",
		uploadedAt: "2024-09-17",
	},
	{
		id: "photo9",
		lowResUrl:
			"D081D1C8-C1BD-4F72-8504-0D498A495537-19829-000004ACF9D55EE1_low.jpg",
		highResUrl:
			"D081D1C8-C1BD-4F72-8504-0D498A495537-19829-000004ACF9D55EE1.webp",
		title: "実験中",
		comment: "実験中の様子。綺麗に撮れたけど地獄でした。",
		uploadedAt: "2023-07-19",
	},
	{
		id: "photo10",
		lowResUrl:
			"7C4DF802-4D05-4B74-9F3A-BF617E09F0AE-52388-00001D904780C86C_low.jpg",
		highResUrl:
			"7C4DF802-4D05-4B74-9F3A-BF617E09F0AE-52388-00001D904780C86C.webp",
		title: "涸沼",
		comment:
			"大洗に行く途中にある涸沼駅にて。気動車が走っていて感動。フォントがいいなーなんて思っていたんですけど、名前はわかりません。",
		uploadedAt: "2024-01-27",
	},
	{
		id: "photo11",
		lowResUrl: "DSCF0016_low.jpg",
		highResUrl: "DSCF0016.webp",
		title: "花火1",
		comment:
			"よくわからない河川敷にて。写っている手の人には長らく会っていません。元気なんすかね。",
		uploadedAt: "2023-08-12",
	},
	{
		id: "photo12",
		lowResUrl: "DSCF0275_low.jpg",
		highResUrl: "DSCF0275.webp",
		title: "平面",
		comment:
			"自分はあまり撮影しない平面の写真。緑のトンネルをとった直後にこれを見つけて、撮影しました。",
		uploadedAt: "2023-08-25",
	},
	{
		id: "photo13",
		lowResUrl: "DSCF0773%201_low.jpg",
		highResUrl: "DSCF0773%201.webp",
		title: "里の曙",
		comment:
			"帰省した時に飲んだ、黒糖焼酎。全然別の銘柄のグラスに注がれていますね。",
		uploadedAt: "2023-09-08",
	},
	{
		id: "photo14",
		lowResUrl: "DSCF0813_low.jpg",
		highResUrl: "DSCF0813.webp",
		title: "花火2",
		comment: "地元では有名な場所である、通称三角浜にて。",
		uploadedAt: "2023-09-09",
	},
	{
		id: "photo15",
		lowResUrl: "DSCF2790_low.jpg",
		highResUrl: "DSCF2790.webp",
		title: "鉄塔と星",
		comment:
			"星空の下、鉄塔を撮影。長秒露光して星だけを動かした。車のハザードを焚きながら待っていたら、故障車だと思われて警察に声をかけられてしまった。",
		uploadedAt: "2023-10-22",
	},
	{
		id: "photo16",
		lowResUrl: "_DSF0382-%E5%BC%B7%E5%8C%96-NR_low.jpg",
		highResUrl: "_DSF0382-%E5%BC%B7%E5%8C%96-NR.webp",
		title: "海と友人と",
		comment:
			"カメラを買って初めて人物を主題に撮影した写真。誘ってくれた友人とモデルになってくれた友人に感謝。",
		uploadedAt: "2023-07-06",
	},
	{
		id: "photo17",
		lowResUrl: "DSCF8674_low.jpg",
		highResUrl: "DSCF8674.webp",
		title: "流しマカロニ",
		comment:
			"筑波大学内にある石の広場にて、友人が企画してくれた流しそうめん。流すものがなくなって、自分が到着したころには流しマカロニになっていました。",
		uploadedAt: "2023-07-12",
	},
	{
		id: "photo18",
		lowResUrl: "DSCF9639_low.jpg",
		highResUrl: "DSCF9639.webp",
		title: "now on stage",
		comment:
			"成人式のため帰省した時のライブハウスにて。友人達のバンドが出演していたので、それを撮影。カッコ良すぎる。",
		uploadedAt: "2024-01-05",
	},
	{
		id: "photo19",
		lowResUrl:
			"https://pbs.twimg.com/media/Gmzg-ceb0AAYCza?format=jpg&name=large",
		highResUrl:
			"_DSF5447NR.webp",
		title: "もし明日が来ないとしたら",
		comment:
			"UNIDOL 2024-25 Winter 決勝戦にて。オフィシャルカメラマンとして参加。\n Xにて演者様に掲載していただけました。 \n https://t.co/wZdm482G13",
		uploadedAt: "2025-02-26",
	},
	{
		id: "photo20",
		lowResUrl: "_DSF0382-%E5%BC%B7%E5%8C%96-NR_low.jpg",
		highResUrl: "_DSF0382-%E5%BC%B7%E5%8C%96-NR.webp",
		title: "呪って呪って",
		comment:
			"Bombs!4th単独公演 4ever〜ぼむずと紡ぐ∞の物語〜にて。オフィシャルカメラマンとして参加。 \n目のハイライトの入り方、好きです。",
		uploadedAt: "2025-03-14",
	},
	{
		id: "photo21",
		lowResUrl: "_DSF0766-%E5%BC%B7%E5%8C%96-NR_low.jpg",
		highResUrl: "_DSF0766-%E5%BC%B7%E5%8C%96-NR.webp",
		title: "ぼくらのうた",
		comment:
			"Bombs!4th単独公演 4ever〜ぼむずと紡ぐ∞の物語〜にて。オフィシャルカメラマンとして参加。 \n卒業代の先輩方を撮影させていただきました。",
		uploadedAt: "2025-03-14",
	},
	{
		id: "photo22",
		lowResUrl: "IMG_6408_low.jpg",
		highResUrl: "IMG_6408.webp",
		title: "お見送り",
		comment: "高校卒業後、島を出ていく友人のお見送り。",
		uploadedAt: "2022-03-06",
	},
	{
		id: "photo23",
		lowResUrl: "IMG_2991_low.webp",
		highResUrl: "IMG_2991.jpeg",
		title: "筑波山",
		comment: "筑波山の朝日峠から、日の出を撮影。",
		uploadedAt: "2022-12-14",
	},
]);
