import type { Metadata } from "next";
import { GlobalStyle } from "../styles/globalStyles";
import AppLoader from "@/components/AppLoader";

export const metadata: Metadata = {
	title: "ふわふわ.みんな",
	description: "Portfolio site",
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head />
			<body>
				<AppLoader />
				<GlobalStyle />
				{children}
			</body>
		</html>
	);
}
