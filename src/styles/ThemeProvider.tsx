"use client";

import { ThemeProvider as StyledThemeProvider } from "styled-components";
import theme from "@/styles/theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>;
}
