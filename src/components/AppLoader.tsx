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
	width: 100%;
	height: 100%;
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
					<path
						id="circlePath"
						d="M 60,60 m -50,0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
					/>
				</defs>
				<text
					fill="#ffffff"
					fontSize="10"
					fontWeight="bold"
					letterSpacing="2"
					textAnchor="middle"
				>
					<textPath xlinkHref="#circlePath" startOffset="60%">
						Loading... Loading... Loading...
					</textPath>
				</text>
			</CircleContainer>
		</LoaderWrapper>
	);
};

export default AppLoader;
