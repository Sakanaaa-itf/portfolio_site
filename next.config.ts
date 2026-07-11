import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: {
		styledComponents: true,
	},
	images: {
		unoptimized: true,
	},
	output: "export",
	reactStrictMode: true,
	trailingSlash: true,
	typedRoutes: true,
};

export default nextConfig;
