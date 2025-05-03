import ThemeProvider from "@/styles/ThemeProvider";
import { jetbrainsMono, udevGothic } from "@/styles/fonts";

import { GlobalStyle } from "../styles/globalStyles";

import type { Metadata } from "next";

export const metadata: Metadata = {
	description: "Portfolio site",
	icons: [
		{ rel: "icon", url: "/favicon.ico" },
		{ rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
	],
	title: "ふわふわ.みんな",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html className={`${jetbrainsMono.variable} ${udevGothic.variable}`} lang="ja">
			<body>
				<ThemeProvider>
					<GlobalStyle />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
