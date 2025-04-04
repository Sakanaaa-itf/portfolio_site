import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		colors: {
			primary: string;
			background: string;
		};
		breakpoints: {
			mobile: string;
			tablet: string;
			laptop: string;
		};
	}
}
