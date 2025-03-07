"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import theme from "../styles/theme";
import HamburgerMenu from "./HamburgerMenu";

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
	body.menu-open & {
		filter: blur(10px);
	}
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
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0) 0%,
		rgba(34, 34, 34, 0.8) 100%
	);
	color: white;
	font-size: 24px;
	transition: transform 0.8s ease-in-out, opacity 0.8s ease-in-out;
	transform: translateY(0);
	opacity: 1;
	padding: 2rem;
`;

const AboutMeTitle = styled.h2`
	font-size: 36px;
	font-weight: 700;
	margin-bottom: 1rem;
	text-align: center;
`;

const ProfileCard = styled.div<{ $isFlipped: boolean }>`
	width: 150px;
	height: 150px;
	position: relative;
	perspective: 1000px;
	cursor: pointer;
	margin-bottom: 1rem;

	& > div {
		width: 100%;
		height: 100%;
		position: absolute;
		backface-visibility: hidden;
		transition: transform 0.6s ease-in-out;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.front {
		transform: ${(props) => props.$isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"};
	}

	.back {
		transform: ${(props) => props.$isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)"};
		background: white;
		color: black;
		font-size: 14px;
		font-weight: bold;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
	}
`;

const ProfileIcon = styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
	border: 3px solid white;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

const ProfileLink = styled.a`
	color: black;
	text-decoration: underline;
	font-size: 14px;
	text-align: center;
	font-weight: bold;
	transition: color 0.3s ease-in-out;

	&:hover {
		color: #0070f3;
	}
`;

const AboutMeText = styled.p`
	font-size: 18px;
	max-width: 800px;
	text-align: center;
	line-height: 1.6;
	opacity: 0.9;
`;

const ProfileWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 2rem;

	@media (max-width: 480px) {
		transform: translateX(0);
		transition: transform 0.3s ease-in-out;

		body.menu-open & {
			transform: translateX(-50px);
		}
	}
`;

const Name = styled.h3`
	font-size: 24px;
	font-weight: 700;
`;

const Home = () => {
	const [scrollAmount, setScrollAmount] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);

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
			<HamburgerMenu />
			<BackgroundWrapper $blurAmount={blurAmount} />
			<ContentWrapper id="home">
				<TitleWrapper $opacity={opacity}>
					<Title>Portfolio_</Title>
					<Title>Site_</Title>
				</TitleWrapper>
				<AboutMeWrapper id="about">
					<ProfileWrapper>
						<AboutMeTitle>About Me</AboutMeTitle>
						<ProfileCard
							$isFlipped={isFlipped}
							onClick={() => setIsFlipped(!isFlipped)}
						>
							<div className="front">
								<ProfileIcon src="/profile.webp" alt="プロフィール画像" />
							</div>
							<div className="back">
								<ProfileLink
									href="https://iorin.io"
									target="_blank"
									rel="noopener noreferrer"
								>
									photo by iorin.io
								</ProfileLink>
							</div>
						</ProfileCard>
						<Name>岡 海摩</Name>
						<Name>Kaima Oka</Name>
					</ProfileWrapper>
					<AboutMeText>
						ふわふわ.みんなへようこそ！
						<br />
						フロントエンドエンジニアをやっていたり、雰囲気で写真をやっていたりします。
						<br />
						現在は、筑波大学で情報科学を学ぶ大学生もやっています。
					</AboutMeText>
				</AboutMeWrapper>
			</ContentWrapper>
		</>
	);
};

export default Home;
