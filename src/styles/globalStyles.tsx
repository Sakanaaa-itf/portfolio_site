"use client";

import { createGlobalStyle } from "styled-components";
import { jetbrainsMono } from "./fonts";

export const GlobalStyle = createGlobalStyle`
	:root {
		${jetbrainsMono.variable}; /* JetBrains Mono の CSS 変数を適用 */
	}

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: var(--font-jetbrains-mono), sans-serif;
	}

	body {
		background-color: #000;
		color: white;
	}
`;
