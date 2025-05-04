"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { photos, PhotoMeta } from "@/data/photos";
import theme from "@/styles/theme";

import AppLoader from "./AppLoader";
import HamburgerMenu from "./HamburgerMenu";

const Container = styled.div`
	max-width: 1200px;
	padding: 1rem;
	margin: 0 auto;
	transition: filter 0.3s ease-in-out;
	body.menu-open & {
		filter: blur(5px);
	}
`;

const SectionTitle = styled.h2`
	margin-bottom: 1rem;
	font-size: 24px;
`;

const PhotoGrid = styled.div<{ $isSmall?: boolean }>`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;

	@media (max-width: ${theme.breakpoints.tablet}) {
		${({ $isSmall }) => $isSmall && "grid-template-columns: repeat(2, 1fr);"}
	}
`;

const PhotoItemContainer = styled.figure<{ $isSquare: boolean }>`
	position: relative;
	width: 100%;
	margin: 0;
	cursor: pointer;
`;

const ImageWrapper = styled.div<{ $isSquare: boolean }>`
	position: relative;
	width: 100%;
	padding-top: ${({ $isSquare }) => ($isSquare ? "100%" : "70%")};
	overflow: hidden;
`;

const StyledImage = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const FigCaption = styled.figcaption`
	width: 90%;
	margin-top: 0.5rem;
	font-size: 12px;
	color: #ccc;
	text-align: center;
`;

function PhotoThumbnail({ photo, isSquare }: { isSquare: boolean; photo: PhotoMeta }) {
	return (
		<PhotoItemContainer $isSquare={isSquare}>
			<ImageWrapper $isSquare={isSquare}>
				<StyledImage alt={photo.title} src={photo.lowResUrl} />
			</ImageWrapper>
			{!isSquare && <FigCaption>{photo.title}</FigCaption>}
		</PhotoItemContainer>
	);
}

export default function PhotoworksPage() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	const sorted = [...photos].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
	const recentPhotos = sorted.slice(0, 5);
	const otherPhotos = sorted.slice(5);

	if (isLoading) return <AppLoader />;

	return (
		<>
			<HamburgerMenu />
			<Container>
				<SectionTitle>Recent photos</SectionTitle>
				<PhotoGrid>
					{recentPhotos.map((photo) => (
						<Link
							href={`/photoworks/${photo.id}`}
							key={photo.id}
							scroll={false}
							style={{ textDecoration: "none" }}
						>
							<PhotoThumbnail isSquare={false} photo={photo} />
						</Link>
					))}
				</PhotoGrid>

				<SectionTitle>Others</SectionTitle>
				<PhotoGrid $isSmall={true}>
					{otherPhotos.map((photo) => (
						<Link
							href={`/photoworks/${photo.id}`}
							key={photo.id}
							scroll={false}
							style={{ textDecoration: "none" }}
						>
							<PhotoThumbnail isSquare={true} photo={photo} />
						</Link>
					))}
				</PhotoGrid>
			</Container>
		</>
	);
}
