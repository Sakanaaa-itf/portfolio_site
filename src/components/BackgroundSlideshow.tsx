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
	inset: 0;
	z-index: -1;
	background-image: url(${(p) => p.$currentBg});
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	background-color: black;
	filter: blur(${(p) => p.$blurAmount}px);
	transition: filter 0.3s ease-in-out;

	body.menu-open & {
		filter: blur(10px);
	}
`;

interface BackgroundSlideshowProps {
	blurAmount: number;
	onReady?: () => void;
}

async function fetchDecodeToObjectUrl(src: string): Promise<string> {
	const res = await fetch(src, { mode: "cors", cache: "force-cache" }).catch(
		() => null,
	);
	if (!res || !res.ok) return src;
	const blob = await res.blob();
	const objectUrl = URL.createObjectURL(blob);

	await new Promise<void>((resolve) => {
		const img = new Image();
		img.onload = () => {
			(img)
				.decode?.()
				.catch(() => {})
				.finally(resolve);
		};
		img.onerror = () => resolve();
		img.src = objectUrl;
	});

	return objectUrl;
}

export default function BackgroundSlideshow({
	blurAmount,
	onReady,
}: BackgroundSlideshowProps) {
	const n = photos.length;
	const randomStart = Math.floor(Math.random() * Math.max(n, 1));

	const [currentBg, setCurrentBg] = useState<string>("");
	const [isBlackVisible, setIsBlackVisible] = useState(true);

	const indexRef = useRef<number>(randomStart);
	const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const mountedRef = useRef(true);

	const didInitRef = useRef(false);
	const isRunningRef = useRef(false);

	const urlCacheRef = useRef<Map<string, string>>(new Map());
	const inflightRef = useRef<Map<string, Promise<string>>>(new Map());

	const revokeAll = useCallback(() => {
		for (const [, url] of urlCacheRef.current) URL.revokeObjectURL(url);
		urlCacheRef.current.clear();
	}, []);

	useEffect(() => {
		return () => {
			mountedRef.current = false;
			for (const t of timersRef.current) clearTimeout(t);
			timersRef.current = [];
			revokeAll();
			inflightRef.current.clear();
		};
	}, [revokeAll]);

	const keepInCache = useCallback((key: string, objectUrl: string) => {
		const cache = urlCacheRef.current;
		if (cache.has(key)) cache.delete(key);
		cache.set(key, objectUrl);
		while (cache.size > 3) {
			const oldestKey = cache.keys().next().value as string | undefined;
			if (!oldestKey) break;
			const oldestUrl = cache.get(oldestKey)!;
			cache.delete(oldestKey);
			URL.revokeObjectURL(oldestUrl);
		}
	}, []);

	const getObjectUrl = useCallback(
		async (highUrl: string): Promise<string> => {
			const cache = urlCacheRef.current;
			const hit = cache.get(highUrl);
			if (hit) return hit;

			const inflight = inflightRef.current.get(highUrl);
			if (inflight) return inflight;

			const p = fetchDecodeToObjectUrl(highUrl)
				.then((obj) => {
					keepInCache(highUrl, obj);
					return obj;
				})
				.finally(() => {
					inflightRef.current.delete(highUrl);
				});

			inflightRef.current.set(highUrl, p);
			return p;
		},
		[keepInCache],
	);

	const nextIndex = useCallback((i: number) => (i + 1) % n, [n]);

	const startCycle = useCallback(() => {
		if (isRunningRef.current) return;
		isRunningRef.current = true;

		const step = () => {
			const t1 = setTimeout(() => {
				if (!mountedRef.current || n === 0) return;
				setIsBlackVisible(true);

				const upcomingIndex = nextIndex(indexRef.current);
				const upcoming = photos[upcomingIndex];

				const t2 = setTimeout(async () => {
					if (!mountedRef.current) return;

					const nextObjectUrl = await getObjectUrl(upcoming.highResUrl);
					if (mountedRef.current) setCurrentBg(nextObjectUrl);

					indexRef.current = upcomingIndex;

					const t3 = setTimeout(() => {
						if (!mountedRef.current) return;
						setIsBlackVisible(false);

						const warmNext = photos[nextIndex(upcomingIndex)];
						getObjectUrl(warmNext.highResUrl).catch(() => {});

						const t4 = setTimeout(step, 1000);
						timersRef.current.push(t4);
					}, 1000);
					timersRef.current.push(t3);
				}, 1000);
				timersRef.current.push(t2);
			}, 8000);
			timersRef.current.push(t1);
		};

		step();
	}, [n, nextIndex, getObjectUrl]);

	useEffect(() => {
		if (n === 0 || didInitRef.current) return;
		didInitRef.current = true;

		(async () => {
			const first = photos[indexRef.current];
			const second = photos[nextIndex(indexRef.current)];

			const [firstObjUrl] = await Promise.all([
				getObjectUrl(first.highResUrl),
				n > 1 ? getObjectUrl(second.highResUrl) : Promise.resolve(""),
			]);

			if (!mountedRef.current) return;

			setCurrentBg(firstObjUrl);
			setIsBlackVisible(false);
			onReady?.();
			startCycle();
		})();
	}, [n, onReady, startCycle, nextIndex, getObjectUrl]);

	return (
		<SlideshowContainer $blurAmount={blurAmount} $currentBg={currentBg}>
			<BlackOverlay $isVisible={isBlackVisible} />
		</SlideshowContainer>
	);
}
