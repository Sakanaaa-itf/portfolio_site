"use client";

import { useState, useEffect } from "react";
import { useTheme, DefaultTheme } from "styled-components";

export function useDevice() {
	const theme: DefaultTheme = useTheme();
	const [isMobile, setIsMobile] = useState(false);
	const [isTablet, setIsTablet] = useState(false);
	const [isLaptop, setIsLaptop] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined" && theme.breakpoints) {
			const mobileQuery = window.matchMedia(
				`(max-width: ${theme.breakpoints.mobile})`,
			);
			const tabletQuery = window.matchMedia(
				`(min-width: ${theme.breakpoints.mobile}) and (max-width: ${theme.breakpoints.tablet})`,
			);
			const laptopQuery = window.matchMedia(
				`(min-width: ${theme.breakpoints.tablet})`,
			);

			setIsMobile(mobileQuery.matches);
			setIsTablet(tabletQuery.matches);
			setIsLaptop(laptopQuery.matches);

			const handleResize = () => {
				setIsMobile(mobileQuery.matches);
				setIsTablet(tabletQuery.matches);
				setIsLaptop(laptopQuery.matches);
			};

			mobileQuery.addEventListener("change", handleResize);
			tabletQuery.addEventListener("change", handleResize);
			laptopQuery.addEventListener("change", handleResize);

			return () => {
				mobileQuery.removeEventListener("change", handleResize);
				tabletQuery.removeEventListener("change", handleResize);
				laptopQuery.removeEventListener("change", handleResize);
			};
		}
	}, [theme]);

	return { isMobile, isTablet, isLaptop };
}
