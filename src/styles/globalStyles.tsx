"use client";

import { createGlobalStyle } from "styled-components";
import { jetbrainsMono, udevGothic } from "../styles/fonts";

export const GlobalStyle = createGlobalStyle`
	:root {
		${jetbrainsMono.variable};
		${udevGothic.variable};
	}
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	html {
		font-family: var(--font-udev-gothic), var(--font-jetbrains-mono), sans-serif;
	}

	body {
		background-color: #000;
		color: white;
		font-family: var(--font-udev-gothic), var(--font-jetbrains-mono), sans-serif;
	}
`;
