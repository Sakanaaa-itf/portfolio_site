"use client";

import { useState, useEffect } from "react";
import React from "react";
import styled from "styled-components";
import { photos, PhotoMeta } from "@/data/photos";
import HamburgerMenu from "./HamburgerMenu";
import AppLoader from "./AppLoader";
import { useDevice } from "@/hooks/useDevice";
import { getExifDataForPhoto, ExifData } from "@/utils/photoUtils";

// ▼ レイアウト系Styled Components --------------------------------

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

const LoaderOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.7);
	z-index: 99;
`;

const FigCaption = styled.figcaption`
	margin-top: 0.5rem;
	font-size: 12px;
	color: #ccc;
	text-align: center;
	width: 90%;
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

const ModalImageWrapper = styled.div`
	position: relative;
	width: 100%;
`;

const FullImage = styled.img`
	max-width: 100%;
	max-height: 70vh;
	display: block;
	margin: 0 auto;
	loading: lazy;
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

// ▼ シェアボタン用スタイル -------------------------------------

const SocialShareContainer = styled.div`
	margin-top: 1rem;
	display: flex;
	gap: 0.5rem;
`;

const SocialShareButton = styled.button`
	background-color: #1da1f2;
	color: #fff;
	border: none;
	border-radius: 4px;
	padding: 0.5rem 1rem;
	font-size: 12px;
	cursor: pointer;

	&:hover {
		opacity: 0.8;
	}
`;

// ▼ Twitter共有処理 -------------------------------------------

/**
 * Twitterにシェアする際、「個別ページURL」を使う。
 * (モーダル上ではURLが変わらないため、Twitterが正しくOGPを取得できない)
 *
 * つまり、 /photoworks/[id] へ直接飛ばすため、
 * そこに用意したOGP(og:image等)をTwitterが読み込み、サムネ付きカードを生成する。
 */
function handleShareToTwitter(photo: PhotoMeta) {
	// 個別写真のページ (og:image をセットしてある)
	// 例: https://xn--19ja1fb.xn--q9jyb4c/photoworks/photo1
	const detailUrl = `https://xn--19ja1fb.xn--q9jyb4c/photoworks/${photo.id}`;

	const text = encodeURIComponent(`New photo! "${photo.title}" \n @sakanaaa_photo \n`);
	const url = encodeURIComponent(detailUrl);
	const twitterShareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

	window.open(twitterShareUrl, "_blank");
}

// ▼ テキスト内URL自動リンク関数 (任意) -----------------------
function transformText(text: string): React.ReactNode {
	const lines = text.split("\n");
	return lines.map(
		(line: string, lineIndex: number): React.ReactNode => (
			<React.Fragment key={lineIndex}>
				{line.split(/(https?:\/\/[^\s]+)/g).map(
					(part: string, partIndex: number): React.ReactNode =>
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
		)
	);
}

// ▼ サムネイルコンポーネント ----------------------------------
function PhotoThumbnail({
	photo,
	isSquare,
	onClick,
}: {
	photo: PhotoMeta;
	isSquare: boolean;
	onClick: () => void;
}) {
	const [isLowResLoaded, setIsLowResLoaded] = useState(false);
	const [lowResError, setLowResError] = useState(false);
	const [currentSrc, setCurrentSrc] = useState(photo.lowResUrl);

	const handleLowResLoad = () => {
		setIsLowResLoaded(true);
		const highResImg = new Image();
		highResImg.src = photo.highResUrl;
		highResImg.onload = () => {
			setCurrentSrc(photo.highResUrl);
		};
	};

	const handleLowResError = () => {
		setLowResError(true);
	};

	if (lowResError) {
		return null;
	}

	return (
		<PhotoItemContainer $isSquare={isSquare} onClick={onClick}>
			<ImageWrapper $isSquare={isSquare}>
				<StyledImage
					src={currentSrc}
					alt={photo.title}
					onLoad={handleLowResLoad}
					onError={handleLowResError}
				/>
				{!isLowResLoaded && (
					<LoaderOverlay>
						<AppLoader />
					</LoaderOverlay>
				)}
			</ImageWrapper>
			{!isSquare && <FigCaption>{photo.title}</FigCaption>}
		</PhotoItemContainer>
	);
}

// ▼ メインコンポーネント (一覧＆モーダル) ----------------------

export default function PhotoworksPage() {
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoMeta | null>(null);
	const [exifData, setExifData] = useState<ExifData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [modalLoaded, setModalLoaded] = useState(false);
	const { isMobile } = useDevice();
	const [modalSrc, setModalSrc] = useState<string | null>(null);

	// 1秒ローディング
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	// モーダルを開くタイミングでEXIFを読み込み、画像をhighResに差し替え
	useEffect(() => {
		if (selectedPhoto) {
			document.body.style.overflow = "hidden";
			setModalLoaded(false);
			setExifData(null);

			setModalSrc(selectedPhoto.lowResUrl);
			const highResImg = new Image();
			highResImg.src = selectedPhoto.highResUrl;
			highResImg.onload = () => setModalSrc(selectedPhoto.highResUrl);

			getExifDataForPhoto(selectedPhoto).then((data) => setExifData(data));
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [selectedPhoto]);

	// ソート (新しい日時 → 古い日時)
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
								<PhotoThumbnail
									key={photo.id}
									photo={photo}
									isSquare={false}
									onClick={() => setSelectedPhoto(photo)}
								/>
							))}
						</PhotoGrid>

						<SectionTitle>Others_</SectionTitle>
						<PhotoGrid $isSmall={true}>
							{otherPhotos.map((photo) => (
								<PhotoThumbnail
									key={photo.id}
									photo={photo}
									isSquare={true}
									onClick={() => setSelectedPhoto(photo)}
								/>
							))}
						</PhotoGrid>
					</Content>
				</Container>
			)}

			<ModalOverlay
				$isOpen={!!selectedPhoto}
				onClick={() => setSelectedPhoto(null)}
			>
				<ModalContent $isOpen={!!selectedPhoto}>
					{!modalLoaded && (
						<LoaderOverlay>
							<AppLoader />
						</LoaderOverlay>
					)}

					{selectedPhoto && modalSrc && (
						<>
							<ModalImageWrapper>
								<FullImage
									src={modalSrc}
									alt="Selected"
									onLoad={() => setModalLoaded(true)}
								/>
							</ModalImageWrapper>

							{isMobile ? (
								<MobileInfoWrapper>
									<Title>{selectedPhoto.title}</Title>
									<Comment>{transformText(selectedPhoto.comment)}</Comment>
									<p>Date: {exifData?.dateTime || "-"}</p>
									<p>Camera: {exifData?.cameraModel || "-"}</p>
									<p>Lens: {exifData?.lensModel || "-"}</p>
									<p>Aperture: {exifData?.aperture || "-"}</p>
									<p>SS: {exifData?.shutterSpeed || "-"}</p>
									<p>ISO: {exifData?.iso || "-"}</p>
									<p>Focal Length: {exifData?.focalLength || "-"}</p>

									{/* Twitter共有ボタン */}
									<SocialShareContainer>
										<SocialShareButton
											onClick={() => handleShareToTwitter(selectedPhoto)}
										>
											Share to Twitter
										</SocialShareButton>
									</SocialShareContainer>
								</MobileInfoWrapper>
							) : (
								<InfoContainer>
									<CommentBox>
										<Title>{selectedPhoto.title}</Title>
										<Comment>{transformText(selectedPhoto.comment)}</Comment>
									</CommentBox>
									<ExifDataContainer>
										<p>Date: {exifData?.dateTime || "-"}</p>
										<p>Camera: {exifData?.cameraModel || "-"}</p>
										<p>Lens: {exifData?.lensModel || "-"}</p>
										<p>Aperture: {exifData?.aperture || "-"}</p>
										<p>SS: {exifData?.shutterSpeed || "-"}</p>
										<p>ISO: {exifData?.iso || "-"}</p>
										<p>Focal Length: {exifData?.focalLength || "-"}</p>

										{/* Twitter共有ボタン */}
										<SocialShareContainer>
											<SocialShareButton
												onClick={() => handleShareToTwitter(selectedPhoto)}
											>
												Share to Twitter
											</SocialShareButton>
										</SocialShareContainer>
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
