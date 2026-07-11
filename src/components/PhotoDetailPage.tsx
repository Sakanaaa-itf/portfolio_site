"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import HamburgerMenu from "@/components/HamburgerMenu";
import PhotoDetailInfo from "@/components/PhotoDetailInfo";
import theme from "@/styles/theme";

import type { PhotoMeta } from "@/data/photos";
import type { Route } from "next";

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	padding: 1rem;
`;

const Content = styled.article`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	transition: filter 0.3s ease-in-out;

	body.menu-open & {
		filter: blur(5px);
	}
`;

const Title = styled.h1`
	margin: 0.5rem 0;
	font-size: 24px;
	text-align: center;
`;

const Viewer = styled.div`
	position: relative;
	width: 100%;
	max-width: 1200px;
`;

const ImageWrapper = styled.div`
	position: relative;
	width: 100%;
	height: calc(100dvh - 200px);
	min-height: 320px;

	@media (max-width: ${theme.breakpoints.mobile}) {
		height: auto;
		min-height: 0;
		aspect-ratio: 3 / 2;
	}
`;

const Navigation = styled.nav`
	position: absolute;
	top: 50%;
	right: clamp(0.5rem, 2vw, 2rem);
	left: clamp(0.5rem, 2vw, 2rem);
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-items: center;
	pointer-events: none;
	transform: translateY(-50%);

	@media (max-width: ${theme.breakpoints.mobile}) {
		position: static;
		width: 100%;
		margin-top: 0.5rem;
		transform: none;
	}
`;

const NavigationLink = styled(Link)<{ $direction: "next" | "previous" }>`
	display: inline-flex;
	grid-column: ${({ $direction }) => ($direction === "previous" ? "1" : "2")};
	align-items: center;
	justify-content: center;
	justify-self: ${({ $direction }) => ($direction === "previous" ? "start" : "end")};
	width: 2.75rem;
	height: 2.75rem;
	font-size: 40px;
	line-height: 1;
	color: rgb(255 255 255 / 95%);
	text-decoration: none;
	text-shadow: 0 0 10px rgb(0 0 0 / 80%);
	pointer-events: auto;
	background: rgb(0 0 0 / 25%);
	border-radius: 50%;

	&:hover {
		background: rgb(0 0 0 / 55%);
	}

	&:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		width: 2.25rem;
		height: 2.25rem;
		font-size: 28px;
		background: transparent;
	}
`;

const InfoBox = styled.div`
	width: 100%;
	max-width: 1200px;
	margin-top: 1rem;
`;

interface Props {
	nextPhoto: PhotoMeta | null;
	photo: PhotoMeta;
	prevPhoto: PhotoMeta | null;
}

export default function PhotoDetailPage({ photo, prevPhoto, nextPhoto }: Props) {
	return (
		<Main>
			<HamburgerMenu />
			<Content>
				<Title>{photo.title}</Title>
				<Viewer>
					<ImageWrapper>
						<Image
							alt={photo.title}
							fill
							preload
							sizes="(max-width: 1200px) 100vw, 1200px"
							src={photo.highResUrl}
							style={{ objectFit: "contain" }}
						/>
					</ImageWrapper>
					{(prevPhoto || nextPhoto) && (
						<Navigation aria-label="写真間の移動">
							{prevPhoto && (
								<NavigationLink
									$direction="previous"
									aria-label={`前の写真「${prevPhoto.title}」へ`}
									href={`/photoworks/${prevPhoto.id}` as Route}
								>
									<span aria-hidden="true">‹</span>
								</NavigationLink>
							)}
							{nextPhoto && (
								<NavigationLink
									$direction="next"
									aria-label={`次の写真「${nextPhoto.title}」へ`}
									href={`/photoworks/${nextPhoto.id}` as Route}
								>
									<span aria-hidden="true">›</span>
								</NavigationLink>
							)}
						</Navigation>
					)}
				</Viewer>
				<InfoBox>
					<PhotoDetailInfo key={photo.id} photo={photo} />
				</InfoBox>
			</Content>
		</Main>
	);
}
