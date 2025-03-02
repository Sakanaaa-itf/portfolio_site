"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Spinner from "./Spinner"; // 共通スピナーを使用

const LoaderWrapper = styled.div<{ $isFadingOut: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.9);
	z-index: 9999;
	transition: opacity 0.5s ease-in;
	opacity: ${(props) => (props.$isFadingOut ? 0 : 1)};
`;

const AppLoader = () => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [minTimeElapsed, setMinTimeElapsed] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isFadingOut, setIsFadingOut] = useState(false);

	useEffect(() => {
		const img = new Image();
		img.src = "/DSCF0546.webp";
		img.onload = () => setImageLoaded(true);

		const timer = setTimeout(() => {
			setMinTimeElapsed(true);
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (imageLoaded && minTimeElapsed) {
			setIsFadingOut(true); // フェードアウト開始
			setTimeout(() => setIsLoading(false), 500); // 0.5秒後にローダーを非表示
		}
	}, [imageLoaded, minTimeElapsed]);

	if (!isLoading) return null;

	return (
		<LoaderWrapper $isFadingOut={isFadingOut}>
			<Spinner />
		</LoaderWrapper>
	);
};

export default AppLoader;
