"use client";

import Link from "next/link";
import styled from "styled-components";

import { photos } from "@/data/photos";
import theme from "@/styles/theme";
import { sortByDate } from "@/utils/sort";

import HamburgerMenu from "./HamburgerMenu";
import { PhotoThumbnail } from "./PhotoThumbnail";

import type { Route } from "next";

const Container = styled.main`
	max-width: 1200px;
	padding: 1rem;
	margin: 0 auto;
	transition: filter 0.3s ease-in-out;

	body.menu-open & {
		filter: blur(5px);
	}
`;

const PageTitle = styled.h1`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	white-space: nowrap;
	border: 0;
	clip-path: inset(50%);
`;

const PhotoSection = styled.section`
	& + & {
		margin-top: 2rem;
	}
`;

const SectionTitle = styled.h2`
	margin-bottom: 1rem;
	font-size: 24px;
`;

const PhotoGrid = styled.ul<{ $isCompact: boolean }>`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
	padding: 0;
	margin: 0;
	list-style: none;

	@media (max-width: ${theme.breakpoints.tablet}) {
		${({ $isCompact }) => $isCompact && "grid-template-columns: repeat(2, minmax(0, 1fr));"}
	}
`;

const PhotoListItem = styled.li`
	min-width: 0;
`;

const PhotoLink = styled(Link)`
	display: block;
	color: inherit;
	text-decoration: none;

	&:focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 4px;
	}
`;

const sortedPhotos = [...photos].sort(sortByDate);
const photoSections = [
	{
		id: "recent-photos",
		isCompact: false,
		photos: sortedPhotos.slice(0, 5),
		title: "Recent photos",
	},
	{
		id: "other-photos",
		isCompact: true,
		photos: sortedPhotos.slice(5),
		title: "Others",
	},
] as const;

export default function PhotoworksPage() {
	return (
		<>
			<HamburgerMenu />
			<Container>
				<PageTitle>Photoworks</PageTitle>
				{photoSections.map((section) => (
					<PhotoSection aria-labelledby={section.id} key={section.id}>
						<SectionTitle id={section.id}>{section.title}</SectionTitle>
						<PhotoGrid $isCompact={section.isCompact}>
							{section.photos.map((photo) => (
								<PhotoListItem key={photo.id}>
									<PhotoLink
										aria-label={`「${photo.title}」の詳細を見る`}
										href={`/photoworks/${photo.id}` as Route}
									>
										<PhotoThumbnail isSquare={section.isCompact} photo={photo} />
									</PhotoLink>
								</PhotoListItem>
							))}
						</PhotoGrid>
					</PhotoSection>
				))}
			</Container>
		</>
	);
}
