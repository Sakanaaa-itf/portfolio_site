"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import Spinner from "./Spinner";

const LoaderWrapper = styled.div<{ $isFadingOut: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #000000;
	z-index: 9999;
	transition: opacity 0.5s ease-in;
	opacity: ${(props) => (props.$isFadingOut ? 0 : 1)};
`;

const PageLoader = () => {
	const pathname = usePathname();
	const [loading, setLoading] = useState(false);
	const [isFadingOut, setIsFadingOut] = useState(false);

	useEffect(() => {
		setLoading(true);
		setIsFadingOut(false);

		const timer = setTimeout(() => {
			setIsFadingOut(true);
			setTimeout(() => setLoading(false), 500);
		}, 1000);

		return () => clearTimeout(timer);
	}, [pathname]);

	if (!loading) return null;

	return (
		<LoaderWrapper $isFadingOut={isFadingOut}>
			<Spinner />
		</LoaderWrapper>
	);
};

export default PageLoader;
