"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { photos, PhotoMeta } from "@/data/photos";
import HamburgerMenu from "./HamburgerMenu";
import AppLoader from "./AppLoader";

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 1rem;
	transition: filter 0.3s ease-in-out;
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
		grid-template-columns: ${({ $isSmall }) => $isSmall ? "repeat(2, 1fr)" : "repeat(1, 1fr)"};
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

const Gallery = styled.div`
	body.menu-open & {
		filter: blur(8px);
	}
`;

export default function PhotoworksPage() {
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoMeta | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (selectedPhoto) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [selectedPhoto]);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	const sorted = [...photos].sort(
		(a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
	);

	const recentPhotos = sorted.slice(0, 5);
	const otherPhotos = sorted.slice(5);

	return (
		<>
			{isLoading ? (
				<AppLoader /> // 🔹 ロード中は AppLoader を表示
			) : (
				<Container>
					<HamburgerMenu />
					<Gallery>
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
					</Gallery>
				</Container>
			)}
		</>
	);
}
