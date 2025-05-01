import type { Metadata } from "next";
import { GlobalStyle } from "../styles/globalStyles";
import ThemeProvider from "@/styles/ThemeProvider";
import { jetbrainsMono, udevGothic } from "@/styles/fonts";

export const metadata: Metadata = {
	title: "ふわふわ.みんな",
	description: "Portfolio site",
	icons: [
		{ rel: "icon", url: "/favicon.ico" },
		{ rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" className={`${jetbrainsMono.variable} ${udevGothic.variable}`}>
			<body>
				<ThemeProvider>
					<GlobalStyle />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
