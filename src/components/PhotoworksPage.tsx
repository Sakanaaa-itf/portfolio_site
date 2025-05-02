"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { photos, PhotoMeta } from "@/data/photos";
import HamburgerMenu from "./HamburgerMenu";
import AppLoader from "./AppLoader";
import theme from "@/styles/theme";

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 1rem;
	transition: filter 0.3s ease-in-out;
	body.menu-open & {
		filter: blur(5px);
	}
`;

const SectionTitle = styled.h2`
	font-size: 24px;
	margin-bottom: 1rem;
`;

const PhotoGrid = styled.div<{ $isSmall?: boolean }>`
	display: grid;
	gap: 1rem;
	margin-bottom: 2rem;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

	@media (max-width: ${theme.breakpoints.tablet}) {
		${({ $isSmall }) => $isSmall && "grid-template-columns: repeat(2, 1fr);"}
	}
`;

const PhotoItemContainer = styled.figure<{ $isSquare: boolean }>`
	width: 100%;
	cursor: pointer;
	position: relative;
	margin: 0;
`;

const ImageWrapper = styled.div<{ $isSquare: boolean }>`
	width: 100%;
	position: relative;
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
	margin-top: 0.5rem;
	font-size: 12px;
	color: #ccc;
	text-align: center;
	width: 90%;
`;

function PhotoThumbnail({
	photo,
	isSquare,
}: {
	photo: PhotoMeta;
	isSquare: boolean;
}) {
	return (
		<PhotoItemContainer $isSquare={isSquare}>
			<ImageWrapper $isSquare={isSquare}>
				<StyledImage src={photo.lowResUrl} alt={photo.title} />
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
		(a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
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
							key={photo.id}
							href={`/photoworks/${photo.id}`}
							scroll={false}
							style={{ textDecoration: "none" }}
						>
							<PhotoThumbnail photo={photo} isSquare={false} />
						</Link>
					))}
				</PhotoGrid>

				<SectionTitle>Others</SectionTitle>
				<PhotoGrid $isSmall={true}>
					{otherPhotos.map((photo) => (
						<Link
							key={photo.id}
							href={`/photoworks/${photo.id}`}
							scroll={false}
							style={{ textDecoration: "none" }}
						>
							<PhotoThumbnail photo={photo} isSquare={true} />
						</Link>
					))}
				</PhotoGrid>
			</Container>
		</>
	);
}
