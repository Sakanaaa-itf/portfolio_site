"use client";

import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
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
	transition: opacity 0.3s ease-in-out;
	opacity: 1;
`;

const Spinner = styled.div`
	width: 50px;
	height: 50px;
	border: 5px solid #ccc;
	border-top-color: #0070f3;
	border-radius: 50%;
	animation: ${spin} 1s linear infinite;
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

	useEffect(() => {
		const img = new Image();
		img.src = "/DSCF0546.webp";
		img.onload = () => setImageLoaded(true);

		const timer = setTimeout(() => {
			setMinTimeElapsed(true);
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (imageLoaded && minTimeElapsed) {
			setIsLoading(false);
		}
	}, [imageLoaded, minTimeElapsed]);

	return (
		<>
			{isLoading && (
				<LoaderWrapper>
					<Spinner />
				</LoaderWrapper>
			)}
			<BackgroundImage src="/DSCF0546.webp" alt="background" />
		</>
	);
};

export default AppLoader;
