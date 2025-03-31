import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	images: {
		unoptimized: true,
	},
	compiler: {
		styledComponents: true,
	},
	experimental: {
		typedRoutes: false,
	},
	trailingSlash: true,
	distDir: "out",
};

export default nextConfig;
