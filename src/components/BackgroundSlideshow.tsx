"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { photos } from "@/data/photos";

/** 黒画面を覆う要素 */
const BlackOverlay = styled.div<{ isVisible: boolean }>`
	position: absolute;
	inset: 0;
	background-color: black;
	opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
	transition: opacity 1s ease;
`;

/** スライドショーの背景コンテナ */
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

	/* 背景画像の設定 */
	background-image: url(${(props) => props.$currentBg});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;

	/* ぼかしとトランジション */
	filter: blur(${(props) => props.$blurAmount}px);
	transition: filter 0.3s ease-in-out;

	/* メニュー開いた時のぼかし */
	body.menu-open & {
		filter: blur(10px);
	}
`;

interface BackgroundSlideshowProps {
	blurAmount: number;
}

export default function BackgroundSlideshow({ blurAmount }: BackgroundSlideshowProps) {
	const [loadedPhotos, setLoadedPhotos] = useState<string[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isBlackVisible, setIsBlackVisible] = useState(false);
	const timersRef = useRef<NodeJS.Timeout[]>([]);

	/** すべての画像を事前ロードする */
	useEffect(() => {
		const preloadImages = async () => {
			const promises = photos.map((photo) => {
				return new Promise<string>((resolve) => {
					const img = new Image();
					img.src = photo.highResUrl;
					img.onload = () => resolve(photo.highResUrl);
					img.onerror = () => resolve(""); // 読み込み失敗時は空のURL
				});
			});

			// すべての画像がロードされたらリストを更新
			const loadedUrls = await Promise.all(promises);
			setLoadedPhotos(loadedUrls.filter((url) => url !== ""));
		};

		preloadImages();
	}, []);

	/** スライドショーのサイクル管理 */
	const startCycle = useCallback(() => {
		/** (A) 4秒後に黒画面フェードイン開始 */
		const t1 = setTimeout(() => {
			setIsBlackVisible(true);

			/** (B) 1秒後に背景画像を変更 */
			const t2 = setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % loadedPhotos.length);

				/** (C) さらに1秒後に黒画面フェードアウト */
				const t3 = setTimeout(() => {
					setIsBlackVisible(false);

					/** (D) 次のサイクル開始 */
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

	/** スライドショーの開始 */
	useEffect(() => {
		if (loadedPhotos.length > 0) {
			startCycle();
		}

		return () => {
			// 最新のタイマーリストをローカル変数にコピー
			const timers = timersRef.current;
			timers.forEach((t) => clearTimeout(t));
			timersRef.current = []; // クリア後にリセット
		};
	}, [loadedPhotos, startCycle]);

	// 画像がまだロードされていない場合のプレースホルダー
	const currentBg = loadedPhotos.length > 0 ? loadedPhotos[currentIndex] : "";

	return (
		<SlideshowContainer $blurAmount={blurAmount} $currentBg={currentBg}>
			<BlackOverlay isVisible={isBlackVisible} />
		</SlideshowContainer>
	);
}
