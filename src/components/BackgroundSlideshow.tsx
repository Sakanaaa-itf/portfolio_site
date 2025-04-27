"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { photos } from "@/data/photos";

const BlackOverlay = styled.div<{ $isVisible: boolean }>`
	position: absolute;
	inset: 0;
	background-color: black;
	opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
	transition: opacity 1s ease;
`;

const SlideshowContainer = styled.div<{
	$blurAmount: number;
	$currentBg: string;
}>`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	z-index: -1;

	background-image: url(${(props) => props.$currentBg});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;

	filter: blur(${(props) => props.$blurAmount}px);
	transition: filter 0.3s ease-in-out;

	body.menu-open & {
		filter: blur(10px);
	}
`;

interface BackgroundSlideshowProps {
	blurAmount: number;
	onReady?: () => void;
}

export default function BackgroundSlideshow({
	blurAmount,
	onReady,
}: BackgroundSlideshowProps) {
	const [loadedPhotos, setLoadedPhotos] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isBlackVisible, setIsBlackVisible] = useState(false);
	const timersRef = useRef<NodeJS.Timeout[]>([]);

	useEffect(() => {
		const preloadImages = async () => {
			const loadedUrls = await Promise.all(
				photos.map(
					(photo) =>
						new Promise<string>((resolve) => {
							const img = new Image();
							img.src = photo.highResUrl;
							img.onload = () => resolve(photo.highResUrl);
							img.onerror = () => resolve("");
						})
				)
			);
			setLoadedPhotos(loadedUrls.filter((url) => url));
		};

		preloadImages();
	}, []);

	const startCycle = useCallback(() => {
		const t1 = setTimeout(() => {
			setIsBlackVisible(true);

			const t2 = setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % loadedPhotos.length);

				const t3 = setTimeout(() => {
					setIsBlackVisible(false);

					const t4 = setTimeout(() => {
						startCycle();
					}, 1000);

					timersRef.current.push(t4);
				}, 1000);

				timersRef.current.push(t3);
			}, 1000);

			timersRef.current.push(t2);
		}, 8000);

		timersRef.current.push(t1);
	}, [loadedPhotos.length]);

	const readyNotified = useRef(false);
	useEffect(() => {
		if (!readyNotified.current && loadedPhotos.length > 0) {
			readyNotified.current = true;
			onReady?.();
			startCycle();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadedPhotos, startCycle]);

	const currentBg = loadedPhotos.length > 0 ? loadedPhotos[currentIndex] : "";

	return (
		<SlideshowContainer $blurAmount={blurAmount} $currentBg={currentBg}>
			<BlackOverlay $isVisible={isBlackVisible} />
		</SlideshowContainer>
	);
}
