"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { photos } from "@/data/photos";
import theme from "@/styles/theme";
import { sortByDate } from "@/utils/sort";

import AppLoader from "./AppLoader";
import HamburgerMenu from "./HamburgerMenu";
import { PhotoThumbnail } from "./PhotoThumbnail";


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

export default function PhotoworksPage() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);
		return () => clearTimeout(timer);
	}, []);

	const sorted = [...photos].sort(sortByDate);
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
