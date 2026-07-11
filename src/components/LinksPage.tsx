"use client";

import Image from "next/image";
import styled from "styled-components";

import HamburgerMenu from "./HamburgerMenu";

interface LinkItem {
	icon?: string;
	name: string;
	url: string;
}

const LINKS = [
	{
		name: "iorin.io",
		url: "https://iorin.io/",
	},
	{
		icon: "https://pbs.twimg.com/profile_images/1601292387250499584/09YdhLVp_400x400.jpg",
		name: "いなにわうどん.みんな",
		url: "https://xn--n8je9hcf0t4a.xn--q9jyb4c/",
	},
	{
		icon: "https://itsu.dev/icon.svg",
		name: "itsu.dev",
		url: "https://itsu.dev/",
	},
	{
		icon: "https://pbs.twimg.com/profile_images/1797530605137416192/zy_0ipa1_400x400.jpg",
		name: "it4pstudio.com",
		url: "https://it4pstudio.com/",
	},
	{
		name: "uekann.com",
		url: "https://uekann.com/",
	},
	{
		icon: "https://raspi0124.dev/raspi0124.png",
		name: "raspi0124.dev",
		url: "https://raspi0124.dev/",
	},
] satisfies readonly LinkItem[];

const Page = styled.main`
	position: relative;
	min-height: 100svh;
	overflow: hidden;
	isolation: isolate;
`;

const Background = styled.div`
	position: fixed;
	inset: -12px;
	z-index: -1;
	background-image:
		linear-gradient(to bottom, rgb(0 0 0 / 12%), rgb(20 20 20 / 82%)), url("/site-background.webp");
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	filter: blur(5px);
`;

const LinksSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	min-height: 100svh;
	padding: clamp(4rem, 10vw, 7rem) 1.25rem 2rem;
	color: #fff;
	text-align: center;

	body.menu-open & {
		filter: blur(5px);
	}
`;

const Title = styled.h1`
	margin-bottom: 1.5rem;
	font-size: clamp(1.25rem, 4vw, 1.75rem);
	font-weight: 700;
`;

const LinksList = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	gap: 1rem;
	width: min(800px, 100%);
	margin: 0;
	list-style: none;
`;

const LinkListItem = styled.li`
	min-width: 0;
`;

const CardLink = styled.a`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: center;
	width: 100%;
	padding: 0.75rem;
	color: inherit;
	text-align: center;
	text-decoration: none;
	border-radius: 8px;
	transition:
		background-color 0.2s ease,
		transform 0.2s ease;

	&:hover {
		background: rgb(255 255 255 / 10%);
		transform: translateY(-2px);
	}

	&:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;

		&:hover {
			transform: none;
		}
	}
`;

const IconWrapper = styled.span`
	position: relative;
	display: grid;
	place-items: center;
	width: 64px;
	height: 64px;
	overflow: hidden;
	color: #171717;
	background: #fff;
	border: 1px solid #333;
	border-radius: 50%;
`;

const IconFallback = styled.span`
	font-size: 1.25rem;
	font-weight: 700;
	text-transform: uppercase;
`;

const Favicon = styled(Image)`
	object-fit: cover;
`;

const LinkName = styled.h2`
	max-width: 100%;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: clamp(0.75rem, 2vw, 1rem);
	font-weight: 700;
	white-space: nowrap;
`;

export default function LinksPage() {
	return (
		<>
			<HamburgerMenu />
			<Page>
				<Background aria-hidden="true" />
				<LinksSection aria-labelledby="links-title">
					<Title id="links-title">Links_</Title>
					<LinksList>
						{LINKS.map((link) => (
							<LinkListItem key={link.url}>
								<CardLink href={link.url} rel="noopener noreferrer" target="_blank">
									<IconWrapper aria-hidden="true">
										<IconFallback aria-hidden="true">{link.name.at(0)}</IconFallback>
										{"icon" in link && link.icon ? (
											<Favicon
												alt=""
												fill
												loading="lazy"
												referrerPolicy="no-referrer"
												sizes="64px"
												src={link.icon}
												unoptimized
											/>
										) : null}
									</IconWrapper>
									<LinkName>
										{link.name}
										<span className="sr-only">（新しいタブで開く）</span>
									</LinkName>
								</CardLink>
							</LinkListItem>
						))}
					</LinksList>
				</LinksSection>
			</Page>
		</>
	);
}
