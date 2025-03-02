import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
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
