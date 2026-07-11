"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import theme from "../styles/theme";

import AppLoader from "./AppLoader";
import BackgroundSlideshow from "./BackgroundSlideshow";
import HamburgerMenu from "./HamburgerMenu";

const LOADER_FADE_FALLBACK_MS = 600;

const HomePageRoot = styled.div`
	position: relative;
	isolation: isolate;

	--home-background-blur: 0px;
	--home-title-opacity: 1;
`;

const ContentWrapper = styled.main`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 200vh;
	min-height: 200svh;
`;

const TitleWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100vh;
	min-height: 100svh;
	text-align: center;
	opacity: var(--home-title-opacity);
	transition: opacity 0.5s ease-in-out;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const Title = styled.h1`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0;
	font-size: 80px;
	font-weight: 700;
	color: white;
	white-space: nowrap;
	text-shadow:
		2px 2px 4px rgb(0 0 0 / 80%),
		-2px -2px 4px rgb(255 255 255 / 80%);

	@media (max-width: ${theme.breakpoints.tablet}) {
		flex-direction: column;
		align-items: flex-end;
		width: max-content;
		font-size: 48px;
		line-height: 1.2;
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		font-size: 36px;
		line-height: 1.3;
	}
`;

const TitlePart = styled.span`
	padding: 1rem;
`;

const AboutMeWrapper = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100vh;
	min-height: 100svh;
	padding: 2rem;
	font-size: 24px;
	color: white;
	background: linear-gradient(to bottom, rgb(0 0 0 / 0%) 0%, rgb(34 34 34 / 80%) 100%);
`;

const AboutMeTitle = styled.h2`
	margin-bottom: 1rem;
	font-size: 36px;
	font-weight: 700;
	text-align: center;
`;

const ProfileCard = styled.div`
	position: relative;
	width: 150px;
	height: 150px;
	margin-bottom: 1rem;
	perspective: 1000px;
`;

const ProfileFlipButton = styled.button<{ $isFlipped: boolean }>`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	padding: 0;
	cursor: pointer;
	background: none;
	border: 0;
	border-radius: 50%;

	& > span {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		backface-visibility: hidden;
		transition: transform 0.6s ease-in-out;
	}

	.front {
		transform: ${({ $isFlipped }) => ($isFlipped ? "rotateY(180deg)" : "rotateY(0deg)")};
	}

	.back {
		background: white;
		box-shadow: 0 4px 10px rgb(0 0 0 / 30%);
		transform: ${({ $isFlipped }) => ($isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)")};
	}

	&:focus-visible {
		outline: 3px solid white;
		outline-offset: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		& > span {
			transition: none;
		}
	}
`;

const ProfileIcon = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border: 3px solid white;
	border-radius: 50%;
	box-shadow: 0 4px 10px rgb(0 0 0 / 30%);
`;

const ProfileLink = styled.a<{ $isVisible: boolean }>`
	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 1;
	visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
	font-size: 14px;
	font-weight: bold;
	color: black;
	text-align: center;
	text-decoration: underline;
	pointer-events: ${({ $isVisible }) => ($isVisible ? "auto" : "none")};
	opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
	transform: translate(-50%, -50%);
	transition:
		color 0.3s ease-in-out,
		opacity 0.3s ease-in-out;

	&:hover {
		color: #0070f3;
	}

	&:focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
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

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const Name = styled.h3`
	font-size: 24px;
	font-weight: 700;
`;

export default function Home() {
	const [isFlipped, setIsFlipped] = useState(false);
	const [isLoaderFadingOut, setIsLoaderFadingOut] = useState(false);
	const [isLoaderVisible, setIsLoaderVisible] = useState(true);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let animationFrameId: number | null = null;

		const updateScrollAmount = () => {
			animationFrameId = null;
			const scrollAmount = Math.max(window.scrollY, 0);
			const blurAmount = Math.min(scrollAmount / 50, 10);
			const titleOpacity = Math.max(1 - scrollAmount / 300, 0);

			rootRef.current?.style.setProperty("--home-background-blur", `${blurAmount}px`);
			rootRef.current?.style.setProperty("--home-title-opacity", String(titleOpacity));
		};

		const handleScroll = () => {
			if (animationFrameId !== null) return;
			animationFrameId = window.requestAnimationFrame(updateScrollAmount);
		};

		updateScrollAmount();
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
		};
	}, []);

	const hideLoader = useCallback(() => setIsLoaderVisible(false), []);
	const handleBackgroundReady = useCallback(() => setIsLoaderFadingOut(true), []);

	useEffect(() => {
		if (!isLoaderFadingOut) return;

		const fallbackTimeout = window.setTimeout(hideLoader, LOADER_FADE_FALLBACK_MS);
		return () => window.clearTimeout(fallbackTimeout);
	}, [hideLoader, isLoaderFadingOut]);

	return (
		<HomePageRoot ref={rootRef}>
			{isLoaderVisible && <AppLoader isFadingOut={isLoaderFadingOut} onFadeComplete={hideLoader} />}

			<HamburgerMenu />
			<BackgroundSlideshow onReady={handleBackgroundReady} />
			<ContentWrapper id="home">
				<TitleWrapper>
					<Title aria-label="Portfolio Site">
						<TitlePart aria-hidden="true">Portfolio_</TitlePart>
						<TitlePart aria-hidden="true">Site_</TitlePart>
					</Title>
				</TitleWrapper>

				<AboutMeWrapper id="about">
					<ProfileWrapper>
						<AboutMeTitle>About Me</AboutMeTitle>
						<ProfileCard>
							<ProfileFlipButton
								$isFlipped={isFlipped}
								aria-label={isFlipped ? "プロフィール画像を表に戻す" : "撮影者情報を表示する"}
								aria-pressed={isFlipped}
								onClick={() => setIsFlipped((current) => !current)}
								type="button"
							>
								<span className="front">
									<ProfileIcon alt="岡海摩のプロフィール画像" src="/profile-optimized.webp" />
								</span>
								<span aria-hidden="true" className="back" />
							</ProfileFlipButton>
							<ProfileLink
								$isVisible={isFlipped}
								aria-hidden={!isFlipped}
								href="https://iorin.io"
								rel="noopener noreferrer"
								tabIndex={isFlipped ? 0 : -1}
								target="_blank"
							>
								photo by iorin.io
							</ProfileLink>
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
		</HomePageRoot>
	);
}
