"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

import theme from "../styles/theme";

import AppLoader from "./AppLoader";
import BackgroundSlideshow from "./BackgroundSlideshow";
import HamburgerMenu from "./HamburgerMenu";

const ContentWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 200vh;
`;

const TitleWrapper = styled.div<{ $opacity: number }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 100vh;
	text-align: center;
	opacity: ${(props) => props.$opacity};
	transition: opacity 0.5s ease-in-out;

	@media (max-width: ${theme.breakpoints.tablet}) {
		flex-direction: column;
		align-items: flex-end;
		justify-self: center;
		width: max-content;
	}
`;

const Title = styled.h1`
	padding: 1rem;
	font-size: 80px;
	font-weight: 700;
	color: white;
	white-space: nowrap;
	text-shadow:
		2px 2px 4px rgba(0, 0, 0, 0.8),
		/* 黒い影 */ -2px -2px 4px rgba(255, 255, 255, 0.8); /* 白い影 */

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
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	padding: 2rem;
	font-size: 24px;
	color: white;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(34, 34, 34, 0.8) 100%);
	opacity: 1;
	transform: translateY(0);
	transition:
		transform 0.8s ease-in-out,
		opacity 0.8s ease-in-out;
`;

const AboutMeTitle = styled.h2`
	margin-bottom: 1rem;
	font-size: 36px;
	font-weight: 700;
	text-align: center;
`;

const ProfileCard = styled.div<{ $isFlipped: boolean }>`
	position: relative;
	width: 150px;
	height: 150px;
	margin-bottom: 1rem;
	cursor: pointer;
	perspective: 1000px;

	& > div {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		transition: transform 0.6s ease-in-out;
		backface-visibility: hidden;
	}

	.front {
		transform: ${(props) => (props.$isFlipped ? "rotateY(180deg)" : "rotateY(0deg)")};
	}

	.back {
		font-size: 14px;
		font-weight: bold;
		color: black;
		background: white;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
		transform: ${(props) => (props.$isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)")};
	}
`;

const ProfileIcon = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border: 3px solid white;
	border-radius: 50%;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

const ProfileLink = styled.a`
	font-size: 14px;
	font-weight: bold;
	color: black;
	text-align: center;
	text-decoration: underline;
	transition: color 0.3s ease-in-out;

	&:hover {
		color: #0070f3;
	}
`;

const AboutMeText = styled.p`
	max-width: 800px;
	font-size: 18px;
	line-height: 1.6;
	text-align: center;
	opacity: 0.9;
`;

const ProfileWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 2rem;

	@media (max-width: ${theme.breakpoints.tablet}) {
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

export default function Home() {
	const [scrollAmount, setScrollAmount] = useState(0);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isFadingOut, setIsFadingOut] = useState(false);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrollAmount(window.scrollY);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (isReady) {
			setIsFadingOut(true);
			const t = setTimeout(() => {
				setIsFadingOut(false);
			}, 500);
			return () => clearTimeout(t);
		}
	}, [isReady]);

	const blurAmount = Math.min(scrollAmount / 50, 10);
	const opacity = Math.max(1 - scrollAmount / 300, 0);

	return (
		<>
			{!isReady && <AppLoader isFadingOut={isFadingOut} />}

			<HamburgerMenu />
			<BackgroundSlideshow blurAmount={blurAmount} onReady={() => setIsReady(true)} />
			<ContentWrapper id="home">
				<TitleWrapper $opacity={opacity}>
					<Title>Portfolio_</Title>
					<Title>Site_</Title>
				</TitleWrapper>

				<AboutMeWrapper id="about">
					<ProfileWrapper>
						<AboutMeTitle>About Me</AboutMeTitle>
						<ProfileCard $isFlipped={isFlipped} onClick={() => setIsFlipped(!isFlipped)}>
							<div className="front">
								<ProfileIcon alt="プロフィール画像" src="/profile.webp" />
							</div>
							<div className="back">
								<ProfileLink href="https://iorin.io" rel="noopener noreferrer" target="_blank">
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
}
