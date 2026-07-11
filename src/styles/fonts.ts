import localFont from "next/font/local";

export const udevGothic = localFont({
	display: "swap",
	fallback: ["ui-monospace", "monospace"],
	preload: true,
	src: [
		{
			path: "../../public/fonts/UDEVGothic35-Regular.woff2",
			style: "normal",
			weight: "400",
		},
		{
			path: "../../public/fonts/UDEVGothic35-Bold.woff2",
			style: "normal",
			weight: "700",
		},
	],
	variable: "--font-udev-gothic",
});
