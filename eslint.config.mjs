import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
	...nextVitals,
	...nextTypeScript,
	{
		rules: {
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ fixStyle: "inline-type-imports", prefer: "type-imports" },
			],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-empty-object-type": [
				"error",
				{ allowInterfaces: "with-single-extends" },
			],
			"react/jsx-no-useless-fragment": "error",
		},
	},
	globalIgnores([
		".next/**",
		"out/**",
		"node_modules/**",
		"next-env.d.ts",
		"public/**",
		"おりじなる/**",
		"はいれぞ/**",
		"ろーれぞ/**",
		"らーめん/**",
		"らーめんはい/**",
		"らーめんろー/**",
	]),
]);
