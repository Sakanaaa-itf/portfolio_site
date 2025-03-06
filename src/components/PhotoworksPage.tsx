"use client";

import { useState, useEffect } from "react";
import React from "react";
import styled from "styled-components";
import { photos, PhotoMeta } from "@/data/photos";
import HamburgerMenu from "./HamburgerMenu";
import AppLoader from "./AppLoader";
import { useDevice } from "@/hooks/useDevice";
import { getExifDataForPhotos } from "@/utils/photoUtils";
import type { ExifData } from "@/utils/photoUtils";

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
	gap: 1rem;
	margin-bottom: 2rem;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

	@media (max-width: 768px) {
		${({ $isSmall }) => $isSmall && "grid-template-columns: repeat(2, 1fr);"}
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

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
	visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
	pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
	transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const ModalContent = styled.div<{ $isOpen: boolean }>`
	position: relative;
	background: #fff;
	padding: 1rem;
	border-radius: 8px;
	max-width: 90%;
	max-height: 90%;
	overflow: auto;
	opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
	transform: translateY(${({ $isOpen }) => ($isOpen ? "0" : "-10px")});
	transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
`;

const FullImage = styled.img`
	max-width: 100%;
	max-height: 70vh;
	display: block;
	margin: 0 auto;
`;

const InfoContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-top: 1rem;
	gap: 1rem;
`;

const CommentBox = styled.div`
	flex: 1;
	margin-right: 2rem;
	font-size: 12px;
	color: #333;
`;

const Title = styled.h3`
	font-size: 14px;
	margin-bottom: 0.5rem;
`;

const Comment = styled.p`
	font-size: 12px;
	color: #333;
	margin-bottom: 1rem;
`;

const ExifDataContainer = styled.div`
	margin-top: 1rem;
	font-size: 12px;
	color: #333;
	max-width: 200px;
`;

const MobileInfoWrapper = styled.div`
	margin-top: 1rem;
	max-height: 40vh;
	overflow-y: auto;
	padding: 0 1rem;
	font-size: 12px;
	color: #333;
	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 3px;
	}
`;

const Content = styled.div`
	body.menu-open & {
		filter: blur(5px);
	}
`;

export default function PhotoworksPage() {
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoMeta | null>(null);
	const [photoData, setPhotoData] = useState<Record<string, ExifData | null>>(
		{}
	);
	const [isLoading, setIsLoading] = useState(true);
	const { isMobile } = useDevice();

	useEffect(() => {
		const fetchExifData = async () => {
			const exifMap = await getExifDataForPhotos(photos);
			setPhotoData(exifMap);
			setIsLoading(false);
		};
		fetchExifData();
	}, []);

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

	const transformText = (text: string) => {
		const lines = text.split("\n");
		return lines.map((line, lineIndex) => (
			<React.Fragment key={lineIndex}>
				{line.split(/(https?:\/\/[^\s]+)/g).map((part, partIndex) =>
					/(https?:\/\/[^\s]+)/.test(part) ? (
						<a key={partIndex} href={part} target="_blank" rel="noopener noreferrer">
							{part}
						</a>
					) : (
						<span key={partIndex}>{part}</span>
					)
				)}
				{lineIndex !== lines.length - 1 && <br />}
			</React.Fragment>
		));
	};

	const sorted = [...photos].sort(
		(a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
	);
	const recentPhotos = sorted.slice(0, 5);
	const otherPhotos = sorted.slice(5);

	return (
		<>
			{isLoading ? (
				<AppLoader />
			) : (
				<Container>
					<HamburgerMenu />
					<Content>
						<SectionTitle>Recent photos_</SectionTitle>
						<PhotoGrid>
							{recentPhotos.map((photo) => (
								<PhotoItem
									key={photo.id}
									url={photo.lowResUrl}
									$isSquare={false}
									onClick={() => setSelectedPhoto(photo)}
								>
									<figcaption>{photo.title}</figcaption>
								</PhotoItem>
							))}
						</PhotoGrid>
						<SectionTitle>Others_</SectionTitle>
						{/* $isSmall を true にすることで、モバイルでは2列表示となります */}
						<PhotoGrid $isSmall={true}>
							{otherPhotos.map((photo) => (
								<PhotoItem
									key={photo.id}
									url={photo.lowResUrl}
									$isSquare={false}
									onClick={() => setSelectedPhoto(photo)}
								>
									<figcaption>{photo.title}</figcaption>
								</PhotoItem>
							))}
						</PhotoGrid>
					</Content>
				</Container>
			)}
			<ModalOverlay
				$isOpen={!!selectedPhoto}
				onClick={() => setSelectedPhoto(null)}
			>
				<ModalContent
					$isOpen={!!selectedPhoto}
					onClick={(e) => e.stopPropagation()}
				>
					{selectedPhoto && (
						<>
							<FullImage src={selectedPhoto.highResUrl} alt="Selected" />
							{isMobile ? (
								<MobileInfoWrapper>
									<Title>{selectedPhoto.title}</Title>
									<Comment>{transformText(selectedPhoto.comment)}</Comment>
									<p>Date: {photoData[selectedPhoto.id]?.dateTime || "不明"}</p>
									<p>Camera: {photoData[selectedPhoto.id]?.cameraModel || "不明"}</p>
									<p>Lens: {photoData[selectedPhoto.id]?.lensModel || "不明"}</p>
									<p>Aperture: {photoData[selectedPhoto.id]?.aperture || "不明"}</p>
									<p>SS: {photoData[selectedPhoto.id]?.shutterSpeed || "不明"}</p>
									<p>ISO: {photoData[selectedPhoto.id]?.iso || "不明"}</p>
								</MobileInfoWrapper>
							) : (
								<InfoContainer>
									<CommentBox>
										<Title>{selectedPhoto.title}</Title>
										<Comment>{transformText(selectedPhoto.comment)}</Comment>
									</CommentBox>
									<ExifDataContainer>
										<p>Date: {photoData[selectedPhoto.id]?.dateTime || "不明"}</p>
										<p>Camera: {photoData[selectedPhoto.id]?.cameraModel || "不明"}</p>
										<p>Lens: {photoData[selectedPhoto.id]?.lensModel || "不明"}</p>
										<p>Aperture: {photoData[selectedPhoto.id]?.aperture || "不明"}</p>
										<p>SS: {photoData[selectedPhoto.id]?.shutterSpeed || "不明"}</p>
										<p>ISO: {photoData[selectedPhoto.id]?.iso || "不明"}</p>
									</ExifDataContainer>
								</InfoContainer>
							)}
						</>
					)}
				</ModalContent>
			</ModalOverlay>
		</>
	);
}
