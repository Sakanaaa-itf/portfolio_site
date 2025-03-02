import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},
	compiler: {
		styledComponents: true,
	},
	trailingSlash: true,
	distDir: "out",
};

export default nextConfig;
