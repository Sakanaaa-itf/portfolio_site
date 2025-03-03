import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
	display: "swap",
	variable: "--font-jetbrains-mono",
});

export const udevGothic = localFont({
	src: [
		{
			path: "../../public/fonts/UDEVGothic35-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/UDEVGothic35-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-udev-gothic",
});
