import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		breakpoints: {
			laptop: string;
			mobile: string;
			tablet: string;
		};
		colors: {
			background: string;
			primary: string;
		};
	}
}
