import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: {
		styledComponents: true,
	},
	distDir: "out",
	images: {
		unoptimized: true,
	},
	output: "export",
	trailingSlash: true,
};

export default nextConfig;
