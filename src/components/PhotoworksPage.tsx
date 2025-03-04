"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { photos, PhotoMeta } from "@/data/photos";
import HamburgerMenu from "./HamburgerMenu";
import AppLoader from "./AppLoader";
import * as exifr from "exifr";

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
		/* 正方形にしたい場合は 100% に */
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

/**
 * モーダル背景部分。
 * isOpen によって opacity, pointer-events, visibility を切り替える。
 * これによりアンマウント前にフェードアウトできる。
 */
const ModalOverlay = styled.div<{ isOpen: boolean }>`
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

	opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
	visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
	pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
	transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

/**
 * モーダルの中身コンテナ部分。
 * isOpen によって opacity や transform を変更。
 */
const ModalContent = styled.div<{ isOpen: boolean }>`
	position: relative;
	background: #fff;
	padding: 1rem;
	border-radius: 8px;
	max-width: 90%;
	max-height: 90%;
	overflow: auto;

	/* モーダル表示の際に少し上からフェードインする例 */
	opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
	transform: translateY(${({ isOpen }) => (isOpen ? "0" : "-10px")});
	transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
`;

const FullImage = styled.img`
	max-width: 100%;
	max-height: 70vh;
	display: block;
	margin-bottom: 10px;
`;

const ExifDataContainer = styled.div`
	font-size: 12px;
	color: #333;
`;

type ExifData = {
	dateTime?: string;
	cameraModel?: string;
	lensModel?: string;
	aperture?: string;
	shutterSpeed?: string;
	iso?: string;
};

const formatDate = (date: Date | string | undefined): string => {
	if (!date) return "不明";
	if (typeof date === "string") return date;
	if (date instanceof Date) {
		return date.toISOString().replace("T", " ").split(".")[0];
	}
	return "不明";
};

export default function PhotoworksPage() {
	const [selectedPhoto, setSelectedPhoto] = useState<PhotoMeta | null>(null);
	const [photoData, setPhotoData] = useState<Record<string, ExifData | null>>(
		{}
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchExifData = async () => {
			const exifMap: Record<string, ExifData | null> = {};
			await Promise.all(
				photos.map(async (photo) => {
					try {
						const response = await fetch(photo.highResUrl);
						const blob = await response.blob();
						const exif = await exifr.parse(blob);

						exifMap[photo.id] = {
							dateTime: formatDate(exif?.DateTimeOriginal),
							cameraModel: exif?.Model || "不明",
							lensModel: exif?.LensModel || "不明",
							aperture: exif?.FNumber ? `F${exif.FNumber}` : "不明",
							shutterSpeed: exif?.ExposureTime ? `${exif.ExposureTime}s` : "不明",
							iso: exif?.ISO || "不明",
						};
					} catch (error) {
						console.error(`EXIF データ取得失敗: ${photo.id}`, error);
						exifMap[photo.id] = null;
					}
				})
			);
			setPhotoData(exifMap);
			setIsLoading(false);
		};

		fetchExifData();
	}, []);

	// モーダル表示中はスクロールを固定する
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
				</Container>
			)}

			{/* ここでモーダルは常時マウントし、selectedPhoto が null かどうかでアニメーションさせる */}
			<ModalOverlay
				isOpen={!!selectedPhoto}
				onClick={() => setSelectedPhoto(null)}
			>
				<ModalContent isOpen={!!selectedPhoto} onClick={(e) => e.stopPropagation()}>
					{selectedPhoto && (
						<>
							<FullImage src={selectedPhoto.highResUrl} alt="Selected" />
							<ExifDataContainer>
								<p>撮影日時: {photoData[selectedPhoto.id]?.dateTime || "不明"}</p>
								<p>カメラ: {photoData[selectedPhoto.id]?.cameraModel || "不明"}</p>
								<p>レンズ: {photoData[selectedPhoto.id]?.lensModel || "不明"}</p>
								<p>F値: {photoData[selectedPhoto.id]?.aperture || "不明"}</p>
								<p>
									シャッター速度: {photoData[selectedPhoto.id]?.shutterSpeed || "不明"}
								</p>
								<p>ISO: {photoData[selectedPhoto.id]?.iso || "不明"}</p>
							</ExifDataContainer>
						</>
					)}
				</ModalContent>
			</ModalOverlay>
		</>
	);
}
