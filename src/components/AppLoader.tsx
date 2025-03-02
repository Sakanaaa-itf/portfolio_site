"use client";

import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const rotateCircle = keyframes`
	0% { transform: rotate(360deg); } /* 逆回転 */
	100% { transform: rotate(0deg); }
`;

const fadeOut = keyframes`
	0% { opacity: 1; }
	100% { opacity: 0; }
`;

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
	opacity: ${({ $isFadingOut }) => ($isFadingOut ? 0 : 1)};
`;

const CircleContainer = styled.svg`
	width: 150px;
	height: 150px;
	animation: ${rotateCircle} 3s linear infinite; /* 逆回転 */
	opacity: 0;
	transition: opacity 0.2s ease-in-out;
`;

const BackgroundImage = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	object-fit: cover;
	visibility: hidden;
`;

const AppLoader = () => {
	const [imageLoaded, setImageLoaded] = useState(false);
	const [minTimeElapsed, setMinTimeElapsed] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [showSvg, setShowSvg] = useState(false);
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

	useEffect(() => {
		setTimeout(() => setShowSvg(true), 50);
	}, []);

	return (
		<>
			{isLoading && (
				<LoaderWrapper $isFadingOut={isFadingOut}>
					<CircleContainer
						viewBox="0 0 120 120"
						style={{ opacity: showSvg ? 1 : 0 }}
					>
						<defs>
							<path
								id="circlePath"
								d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
							/>
						</defs>
						<text fill="#ffffff" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle">
							<textPath xlinkHref="#circlePath" startOffset="33%">
								Loading... Loading... Loading...
							</textPath>
						</text>
					</CircleContainer>
				</LoaderWrapper>
			)}
			<BackgroundImage src="/DSCF0546.webp" alt="background" />
		</>
	);
};

export default AppLoader;
