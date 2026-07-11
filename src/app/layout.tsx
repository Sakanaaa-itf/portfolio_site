import "./globals.css";

import StyledComponentsRegistry from "@/styles/StyledComponentsRegistry";
import ThemeProvider from "@/styles/ThemeProvider";
import { udevGothic } from "@/styles/fonts";

import type { Metadata, Viewport } from "next";

const siteUrl = new URL("https://xn--19ja1fb.xn--q9jyb4c/");

export const metadata: Metadata = {
	applicationName: "ふわふわ.みんな",
	authors: [{ name: "Kaima Oka" }],
	creator: "Kaima Oka",
	description: "岡 海摩の写真・制作物・好きな音楽をまとめたポートフォリオサイトです。",
	icons: [
		{ rel: "icon", url: "/favicon.ico" },
		{ rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
	],
	metadataBase: siteUrl,
	openGraph: {
		description: "岡 海摩の写真・制作物・好きな音楽をまとめたポートフォリオサイトです。",
		images: [
			{
				alt: "ふわふわ.みんな",
				height: 630,
				url: "/og-image.webp",
				width: 1200,
			},
		],
		locale: "ja_JP",
		siteName: "ふわふわ.みんな",
		title: "ふわふわ.みんな",
		type: "website",
		url: siteUrl,
	},
	title: {
		default: "ふわふわ.みんな",
		template: "%s | ふわふわ.みんな",
	},
	twitter: {
		card: "summary_large_image",
		creator: "@sakanaaa_photo",
		images: ["/og-image.webp"],
	},
};

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#050505",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={udevGothic.variable} lang="ja">
			<body>
				<StyledComponentsRegistry>
					<ThemeProvider>{children}</ThemeProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
