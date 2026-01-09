"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

import { useDevice } from "@/hooks/useDevice";

import HamburgerMenu from "./HamburgerMenu";

const BackgroundWrapper = styled.div<{ $blurAmount: number }>`
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100vw;
	max-width: 100vw;
	height: 100vh;
	overflow: hidden;
	background-image: url("/DSCF0546.webp");
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	filter: blur(${(props) => props.$blurAmount}px);
	transition: filter 0.3s ease-in-out;
`;

const ContentWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100vh;
	overflow: hidden;
	body.menu-open & {
		filter: blur(5px);
	}
`;

const LinksSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100vh;
	padding: 2rem;
	color: white;
	text-align: center;
	background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(34, 34, 34, 0.8) 100%);
`;

const LinksTitle = styled.h2<{ $fontSize: string }>`
	margin-bottom: 1.5rem;
	font-size: ${(props) => props.$fontSize};
	font-weight: 700;
`;

const LinksContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 1rem;
	justify-content: center;
	justify-items: center;
	width: 100%;
	max-width: 800px;
	margin: 0 auto;
`;

const CardLink = styled.a`
	width: 100%;
	max-width: 180px;
	color: inherit;
	text-decoration: none;
`;

const LinkCard = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	padding: 0.75rem;
	text-align: center;
	border-radius: 8px;
`;

const CardContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: filter 0.3s ease;
	&:hover {
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
	}
`;

const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64px;
	height: 64px;
	margin-bottom: 0.5rem;
	background-color: white;
	border: 1px solid #333333;
	border-radius: 50%;
`;

const LinkFavicon = styled.img`
	width: 64px;
	height: 64px;
	border-radius: 50%;
`;

const LinkName = styled.h3<{ $fontSize: string }>`
	margin-bottom: 0.3rem;
	font-size: ${(props) => props.$fontSize};
	font-weight: 700;
	white-space: nowrap;
`;

const LINKS = [
	{
		customIcon: "",
		fallbackFavicon: "",
		name: "iorin.io",
		url: "https://iorin.io/",
	},
	{
		customIcon: "https://pbs.twimg.com/profile_images/1601292387250499584/09YdhLVp_400x400.jpg",
		fallbackFavicon:
			"https://pbs.twimg.com/profile_images/1601292387250499584/09YdhLVp_400x400.jpg",
		name: "いなにわうどん.みんな",
		url: "https://xn--n8je9hcf0t4a.xn--q9jyb4c/",
	},
	{
		customIcon: "https://itsu.dev/icon.svg",
		fallbackFavicon: "",
		name: "itsu.dev",
		url: "https://itsu.dev/",
	},
	{
		customIcon: "https://pbs.twimg.com/profile_images/1797530605137416192/zy_0ipa1_400x400.jpg",
		fallbackFavicon: "",
		name: "it4pstudio.com",
		url: "https://it4pstudio.com/",
	},
	{
		customIcon: "",
		fallbackFavicon: "",
		name: "uekann.com",
		url: "https://uekann.com/",
	},
	{
		customIcon: "https://raspi0124.dev/raspi0124.png",
		fallbackFavicon: "",
		name: "raspi0124.dev",
		url: "https://raspi0124.dev",
	},
];

export default function LinksPage() {
	const { isMobile, isTablet } = useDevice();
	const titleFontSize = isMobile ? "20px" : isTablet ? "24px" : "28px";
	const nameFontSize = isMobile ? "12px" : isTablet ? "14px" : "16px";

	const [scrollAmount, setScrollAmount] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollAmount(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const blurAmount = Math.min(scrollAmount / 20, 20);

	return (
		<>
			<HamburgerMenu />
			<ContentWrapper>
				<BackgroundWrapper $blurAmount={blurAmount} />
				<LinksSection>
					<LinksTitle $fontSize={titleFontSize}>Links_</LinksTitle>
					<LinksContainer>
						{LINKS.map((link, idx) => {
							const initialSrc =
								link.customIcon && link.customIcon.trim() !== ""
									? link.customIcon
									: `https://www.google.com/s2/favicons?sz=64&domain=${link.url}`;
							return (
								<CardLink href={link.url} key={idx} rel="noopener noreferrer" target="_blank">
									<LinkCard>
										<CardContent>
											<IconWrapper>
												<LinkFavicon
													alt={`${link.name} favicon`}
													onError={(e) => {
														e.currentTarget.onerror = null;
														e.currentTarget.src =
															link.fallbackFavicon && link.fallbackFavicon.trim() !== ""
																? link.fallbackFavicon
																: "/fallback_favicon.png";
													}}
													src={initialSrc}
												/>
											</IconWrapper>
											<LinkName $fontSize={nameFontSize}>{link.name}</LinkName>
										</CardContent>
									</LinkCard>
								</CardLink>
							);
						})}
					</LinksContainer>
				</LinksSection>
			</ContentWrapper>
		</>
	);
}
