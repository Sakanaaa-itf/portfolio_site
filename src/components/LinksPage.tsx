"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import HamburgerMenu from "./HamburgerMenu";
import { useDevice } from "@/hooks/useDevice";

const BackgroundWrapper = styled.div<{ $blurAmount: number }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	max-width: 100vw; /* はみ出し防止 */
	overflow: hidden;
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
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: hidden;

	body.menu-open & {
		filter: blur(5px);
	}
`;

const LinksSection = styled.section`
	width: 100%;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0) 0%,
		rgba(34, 34, 34, 0.8) 100%
	);
	padding: 2rem;
	color: white;
	text-align: center;
`;

const LinksTitle = styled.h2<{ $fontSize: string }>`
	font-size: ${(props) => props.$fontSize};
	font-weight: 700;
	margin-bottom: 1.5rem;
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

/* CardLink：カード自体をリンク化 */
const CardLink = styled.a`
	text-decoration: none;
	color: inherit;
	width: 100%;
	max-width: 180px;
`;

/* LinkCard の背景などはなくし、内部の内容のみで影を作る */
const LinkCard = styled.div`
	width: 100%;
	border-radius: 8px;
	padding: 0.75rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

const CardContent = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	transition: filter 0.3s ease;
	/* ここで drop-shadow を適用するので、コンテンツの形に沿った影がつく */
	&:hover {
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
	}
`;

const LinkFavicon = styled.img`
	width: 64px;
	height: 64px;
	margin-bottom: 0.5rem;
`;

const LinkName = styled.h3<{ $fontSize: string }>`
	font-size: ${(props) => props.$fontSize};
	font-weight: 700;
	margin-bottom: 0.3rem;
	white-space: nowrap;
`;

/* リンク一覧データ：customIcon があればそれを優先、無ければ Google favicon、エラー時は fallbackFavicon（あれば）またはデフォルト */
const LINKS = [
	{
		name: "Iorin.io",
		url: "https://iorin.io/",
		customIcon: "",
		fallbackFavicon: "",
	},
	{
		name: "いなにわうどん.みんな",
		url: "https://xn--n8je9hcf0t4a.xn--q9jyb4c/",
		customIcon:
			"https://pbs.twimg.com/profile_images/1601292387250499584/09YdhLVp_400x400.jpg",
		fallbackFavicon:
			"https://pbs.twimg.com/profile_images/1601292387250499584/09YdhLVp_400x400.jpg",
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
					<LinksTitle $fontSize={titleFontSize}>
						相互リンク集
					</LinksTitle>
					<LinksContainer>
						{LINKS.map((link, idx) => {
							const initialSrc =
								link.customIcon && link.customIcon.trim() !== ""
									? link.customIcon
									: `https://www.google.com/s2/favicons?sz=64&domain=${link.url}`;
							return (
								<CardLink
									key={idx}
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<LinkCard>
										<CardContent>
											<LinkFavicon
												src={initialSrc}
												alt={`${link.name} favicon`}
												onError={(e) => {
													e.currentTarget.onerror = null;
													e.currentTarget.src =
														link.fallbackFavicon &&
														link.fallbackFavicon.trim() !== ""
															? link.fallbackFavicon
															: "/fallback_favicon.png";
												}}
											/>
											<LinkName $fontSize={nameFontSize}>
												{link.name}
											</LinkName>
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
