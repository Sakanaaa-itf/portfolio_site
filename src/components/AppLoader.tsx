"use client";

import { useId, type TransitionEvent } from "react";
import styled, { keyframes } from "styled-components";

const rotateCircle = keyframes`
	from {
		transform: rotate(360deg);
	}

	to {
		transform: rotate(0deg);
	}
`;

const LoaderWrapper = styled.div<{ $isFadingOut: boolean }>`
	position: fixed;
	inset: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: ${({ $isFadingOut }) => ($isFadingOut ? "none" : "auto")};
	background-color: #000;
	opacity: ${({ $isFadingOut }) => ($isFadingOut ? 0 : 1)};
	transition: opacity 0.5s ease-in;

	@media (prefers-reduced-motion: reduce) {
		transition-duration: 0.01ms;
	}
`;

const CircleContainer = styled.svg`
	width: 150px;
	height: 150px;
	animation: ${rotateCircle} 3s linear infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

type AppLoaderProps = {
	isFadingOut?: boolean;
	onFadeComplete?: () => void;
};

export default function AppLoader({ isFadingOut = false, onFadeComplete }: AppLoaderProps) {
	const pathId = useId();

	const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
		if (isFadingOut && event.currentTarget === event.target && event.propertyName === "opacity") {
			onFadeComplete?.();
		}
	};

	return (
		<LoaderWrapper
			$isFadingOut={isFadingOut}
			aria-label="コンテンツを読み込んでいます"
			aria-live="polite"
			onTransitionEnd={handleTransitionEnd}
			role="status"
		>
			<CircleContainer aria-hidden="true" focusable="false" viewBox="0 0 120 120">
				<defs>
					<path d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" id={pathId} />
				</defs>
				<text fill="#fff" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle">
					<textPath href={`#${pathId}`} startOffset="60%">
						Loading... Loading... Loading...
					</textPath>
				</text>
			</CircleContainer>
		</LoaderWrapper>
	);
}
