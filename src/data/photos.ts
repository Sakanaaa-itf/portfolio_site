export interface PhotoMeta {
	id: string;
	lowResUrl: string;
	highResUrl: string;
	comment: string;
	uploadedAt: string;
}

export const photos: PhotoMeta[] = [
	{
		id: "photo1",
		lowResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF0546.webp",
		highResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF0546.webp",
		comment: "機内から、着陸前に。",
		uploadedAt: "2023-09-01",
	},
	{
		id: "photo2",
		lowResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF0276.webp",
		highResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF0276.webp",
		comment: "夏のはじまる前、散歩中に。",
		uploadedAt: "2023-09-05",
	},
	{
		id: "photo3",
		lowResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF7826.webp",
		highResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF7826.webp",
		comment: "Dodge Charenger R/T 440 six pack",
		uploadedAt: "2023-09-06",
	},
	{
		id: "photo4",
		lowResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/_DSF7152.webp",
		highResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/_DSF7152.webp",
		comment: "やどかり祭にて",
		uploadedAt: "2023-09-07",
	},
	{
		id: "photo5",
		lowResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF0845.webp",
		highResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF0845.webp",
		comment: "夏の終わりに。",
		uploadedAt: "2023-09-08",
	},
	{
		id: "photo6",
		lowResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3.webp",
		highResUrl: "https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/E9F54951-2A8F-4D1C-801D-090C3957E512-5334-00000216DF3D70C3.webp",
		comment: "奄美大島にて",
		uploadedAt: "2023-09-08",
	}
];
