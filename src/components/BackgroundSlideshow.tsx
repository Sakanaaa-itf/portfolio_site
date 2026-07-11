"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import styled from "styled-components";

import { photos, type PhotoMeta } from "@/data/photos";

const DISPLAY_DURATION_MS = 8_000;
const FADE_DURATION_MS = 1_000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const BlackOverlay = styled.div<{ $isVisible: boolean }>`
	position: absolute;
	inset: 0;
	pointer-events: none;
	background-color: #000;
	opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
	transition: opacity ${FADE_DURATION_MS}ms ease;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const SlideshowContainer = styled.div<{
	$currentBg: string;
}>`
	position: fixed;
	inset: 0;
	z-index: -1;
	background-color: #000;
	background-image: ${({ $currentBg }) =>
		$currentBg ? `url(${JSON.stringify($currentBg)})` : "none"};
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	filter: blur(var(--home-background-blur, 0));
	transition: filter 0.3s ease-in-out;

	body.menu-open & {
		filter: blur(10px);
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

interface BackgroundSlideshowProps {
	onReady?: () => void;
}

function subscribeToReducedMotion(onChange: () => void) {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
		return () => undefined;
	}

	const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
	mediaQuery.addEventListener("change", onChange);
	return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
	return (
		typeof window !== "undefined" &&
		typeof window.matchMedia === "function" &&
		window.matchMedia(REDUCED_MOTION_QUERY).matches
	);
}

function getServerReducedMotionSnapshot() {
	return false;
}

function usePrefersReducedMotion() {
	return useSyncExternalStore(
		subscribeToReducedMotion,
		getReducedMotionSnapshot,
		getServerReducedMotionSnapshot,
	);
}

export default function BackgroundSlideshow({ onReady }: BackgroundSlideshowProps) {
	const photoCount = photos.length;
	const prefersReducedMotion = usePrefersReducedMotion();
	const [currentBg, setCurrentBg] = useState("");
	const [isBlackVisible, setIsBlackVisible] = useState(true);

	const currentIndexRef = useRef<number | null>(null);
	const imageCacheRef = useRef(new Map<string, Promise<string>>());
	const hasNotifiedReadyRef = useRef(false);
	const onReadyRef = useRef(onReady);

	useEffect(() => {
		onReadyRef.current = onReady;
	}, [onReady]);

	const preloadImage = useCallback((src: string) => {
		const cached = imageCacheRef.current.get(src);
		if (cached) return cached;

		const pending = new Promise<string>((resolve, reject) => {
			const image = new Image();
			image.decoding = "async";
			image.onload = async () => {
				try {
					await image.decode();
				} catch {
					// The image has loaded even when a browser cannot decode it explicitly.
				}
				resolve(src);
			};
			image.onerror = () => reject(new Error(`Failed to load background image: ${src}`));
			image.src = src;
		}).catch((error: unknown) => {
			imageCacheRef.current.delete(src);
			throw error;
		});

		imageCacheRef.current.set(src, pending);
		return pending;
	}, []);

	const resolvePhotoUrl = useCallback(
		async (photo: PhotoMeta) => {
			const candidates = [...new Set([photo.highResUrl, photo.lowResUrl].filter(Boolean))];

			for (const candidate of candidates) {
				try {
					return await preloadImage(candidate);
				} catch {
					// Try the lower-resolution source before allowing CSS to retry the primary URL.
				}
			}

			return photo.highResUrl;
		},
		[preloadImage],
	);

	useEffect(() => {
		let isCancelled = false;
		let timeoutId: number | undefined;
		let finishDelay: (() => void) | undefined;

		const delay = (duration: number) =>
			new Promise<void>((resolve) => {
				finishDelay = resolve;
				timeoutId = window.setTimeout(() => {
					finishDelay = undefined;
					timeoutId = undefined;
					resolve();
				}, duration);
			});

		const notifyReady = () => {
			if (hasNotifiedReadyRef.current) return;
			hasNotifiedReadyRef.current = true;
			onReadyRef.current?.();
		};

		const runSlideshow = async () => {
			if (photoCount === 0) {
				setIsBlackVisible(false);
				notifyReady();
				return;
			}

			if (currentIndexRef.current === null || currentIndexRef.current >= photoCount) {
				currentIndexRef.current = Math.floor(Math.random() * photoCount);
			}

			const initialIndex = currentIndexRef.current;
			const initialPhoto = photos[initialIndex];
			if (!initialPhoto) {
				setIsBlackVisible(false);
				notifyReady();
				return;
			}

			const initialUrl = await resolvePhotoUrl(initialPhoto);
			if (isCancelled) return;

			setCurrentBg(initialUrl);
			setIsBlackVisible(false);
			notifyReady();

			if (prefersReducedMotion || photoCount < 2) return;

			while (!isCancelled) {
				const currentIndex = currentIndexRef.current;
				if (currentIndex === null) return;

				const nextIndex: number = (currentIndex + 1) % photoCount;
				const nextPhoto = photos[nextIndex];
				if (!nextPhoto) return;

				const nextUrlPromise = resolvePhotoUrl(nextPhoto);

				await delay(DISPLAY_DURATION_MS);
				if (isCancelled) return;
				if (document.hidden) continue;

				const nextUrl = await nextUrlPromise;
				if (isCancelled) return;

				setIsBlackVisible(true);
				await delay(FADE_DURATION_MS);
				if (isCancelled) return;

				setCurrentBg(nextUrl);
				currentIndexRef.current = nextIndex;
				setIsBlackVisible(false);
				await delay(FADE_DURATION_MS);
			}
		};

		void runSlideshow();

		return () => {
			isCancelled = true;
			if (timeoutId !== undefined) window.clearTimeout(timeoutId);
			finishDelay?.();
		};
	}, [photoCount, prefersReducedMotion, resolvePhotoUrl]);

	return (
		<SlideshowContainer $currentBg={currentBg} aria-hidden="true">
			<BlackOverlay $isVisible={isBlackVisible} />
		</SlideshowContainer>
	);
}
