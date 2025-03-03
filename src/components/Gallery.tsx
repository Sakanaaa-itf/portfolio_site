"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { photos, PhotoMeta } from "@/data/photos";
import HamburgerMenu from "./HamburgerMenu";

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 1rem;
`;

const SectionTitle = styled.h2`
	font-size: 24px;
	margin-bottom: 1rem;
`;

const PhotoGrid = styled.div<{ $isSmall?: boolean }>`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;

	@media (max-width: 480px) {
		grid-template-columns: ${({ $isSmall }) => ($isSmall ? "repeat(2, 1fr)" : "repeat(1, 1fr)")};
		gap: ${({ $isSmall }) => ($isSmall ? "0.5rem" : "1rem")};
	}
`;

const PhotoItem = styled.figure<{ url: string; $isSquare: boolean }>`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	overflow: hidden;
	position: relative;

	&::before {
		content: "";
		display: block;
		width: 100%;
		padding-top: ${({ $isSquare }) => ($isSquare ? "100%" : "70%")};
		background-image: url(${(p) => p.url});
		background-size: cover;
		background-position: center;
	}

	figcaption {
		margin-top: 0.5rem;
		font-size: 12px;
		color: #ccc;
		text-align: center;
		width: 90%;
	}
`;

const ModalOverlay = styled.div<{ $isVisible: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
	opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
	visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
	transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const ModalImage = styled.img<{ $isVisible: boolean }>`
	max-width: 90vw;
	max-height: 90vh;
	object-fit: contain;
	transform: ${({ $isVisible }) => ($isVisible ? "scale(1)" : "scale(0.8)")};
	transition: transform 0.3s ease-in-out;
`;

export default function PhotoworksPage() {
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoMeta | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (selectedPhoto) {
			setIsVisible(true);
			document.body.style.overflow = "hidden";
		} else {
			setTimeout(() => setIsVisible(false), 300);
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [selectedPhoto]);

	const sorted = [...photos].sort(
		(a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
	);

	const recentPhotos = sorted.slice(0, 5);
	const otherPhotos = sorted.slice(5);

	return (
		<Container>
			<HamburgerMenu />
			<SectionTitle>最近の5枚</SectionTitle>
			<PhotoGrid>
				{recentPhotos.map((photo) => (
					<PhotoItem
						key={photo.id}
						url={photo.lowResUrl}
						$isSquare={false}
						onClick={() => setSelectedPhoto(photo)}
					>
						<figcaption>{photo.comment}</figcaption>
					</PhotoItem>
				))}
			</PhotoGrid>

			<SectionTitle>その他の写真一覧</SectionTitle>
			<PhotoGrid $isSmall={true}>
				{otherPhotos.map((photo) => (
					<PhotoItem
						key={photo.id}
						url={photo.lowResUrl}
						$isSquare={true}
						onClick={() => setSelectedPhoto(photo)}
					>
						<figcaption>{photo.comment}</figcaption>
					</PhotoItem>
				))}
			</PhotoGrid>

			<ModalOverlay
				$isVisible={isVisible}
				onClick={() => setSelectedPhoto(null)}
			>
				{selectedPhoto && (
					<ModalImage
						src={selectedPhoto.highResUrl}
						alt={selectedPhoto.id}
						$isVisible={isVisible}
					/>
				)}
			</ModalOverlay>
		</Container>
	);
}
