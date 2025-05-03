import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const jetbrainsMono = JetBrains_Mono({
	display: "swap",
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
	weight: ["400", "700"],
});

export const udevGothic = localFont({
	display: "swap",
	src: [
		{
			path: "../../public/fonts/UDEVGothic35-Regular.ttf",
			style: "normal",
			weight: "400",
		},
		{
			path: "../../public/fonts/UDEVGothic35-Bold.ttf",
			style: "normal",
			weight: "700",
		},
	],
	variable: "--font-udev-gothic",
});
