"use client";

import styled, { keyframes } from "styled-components";

const rotateCircle = keyframes`
	0% { transform: rotate(360deg); }
	100% { transform: rotate(0deg); }
`;

const LoaderWrapper = styled.div<{ $isFadingOut: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: #000000;
	opacity: ${({ $isFadingOut }) => ($isFadingOut ? 0 : 1)};

	transition: opacity 0.5s ease-in;
`;

const CircleContainer = styled.svg`
	width: 150px;
	height: 150px;
	animation: ${rotateCircle} 3s linear infinite;
`;

type AppLoaderProps = {
	isFadingOut?: boolean;
};

const AppLoader: React.FC<AppLoaderProps> = ({ isFadingOut = false }) => {
	return (
		<LoaderWrapper $isFadingOut={isFadingOut}>
			<CircleContainer viewBox="0 0 120 120">
				<defs>
					<path d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0" id="circlePath" />
				</defs>
				<text fill="#ffffff" fontSize="10" fontWeight="bold" letterSpacing="2" textAnchor="middle">
					<textPath startOffset="60%" xlinkHref="#circlePath">
						Loading... Loading... Loading...
					</textPath>
				</text>
			</CircleContainer>
		</LoaderWrapper>
	);
};

export default AppLoader;
