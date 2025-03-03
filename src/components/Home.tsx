"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../styles/theme";

const BackgroundWrapper = styled.div<{ $blurAmount: number }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-image: url("/DSCF0546.webp");
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	z-index: -1;
	filter: blur(${(props) => props.$blurAmount}px);
	transition: filter 0.3s ease-in-out;
`;

const ContentWrapper = styled.div`
	position: relative;
	width: 100%;
	min-height: 200vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const TitleWrapper = styled.div<{ $opacity: number }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	text-align: center;
	height: 100vh;
	opacity: ${(props) => props.$opacity};
	transition: opacity 0.5s ease-in-out;

	@media (max-width: ${theme.breakpoints.tablet}) {
		flex-direction: column;
		align-items: flex-end;
		width: max-content;
		justify-self: center;
	}
`;

const Title = styled.h1`
	color: white;
	font-size: 80px;
	font-weight: 700;
	padding: 1rem;
	white-space: nowrap;

	@media (max-width: ${theme.breakpoints.tablet}) {
		font-size: 48px;
		line-height: 1.2;
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		font-size: 36px;
		line-height: 1.3;
	}
`;

const AboutMeWrapper = styled.section`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(34, 34, 34, 1) 100%);
	color: white;
	font-size: 24px;
	transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
	transform: translateY(0);
	opacity: 1;
`;

const Home = () => {
	const [scrollAmount, setScrollAmount] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollAmount(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const blurAmount = Math.min(scrollAmount / 50, 10);
	const opacity = Math.max(1 - scrollAmount / 300, 0);

	return (
		<>
			<BackgroundWrapper $blurAmount={blurAmount} />
			<ContentWrapper>
				<TitleWrapper $opacity={opacity}>
					<Title>Portfolio_</Title>
					<Title>Site_</Title>
				</TitleWrapper>
				<AboutMeWrapper>About Me</AboutMeWrapper>
			</ContentWrapper>
		</>
	);
};

export default Home;
