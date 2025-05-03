"use client";

import { createGlobalStyle } from "styled-components";

import { jetbrainsMono, udevGothic } from "../styles/fonts";

export const GlobalStyle = createGlobalStyle`
	:root {
		${jetbrainsMono.variable};
		${udevGothic.variable};
	}
	* {
		box-sizing: border-box;
		padding: 0;
		margin: 0;
	}

	html {
		font-family: var(--font-udev-gothic), var(--font-jetbrains-mono), sans-serif;
	}

	body {
		font-family: var(--font-udev-gothic), var(--font-jetbrains-mono), sans-serif;
		color: white;
		background-color: #000;
	}
`;
