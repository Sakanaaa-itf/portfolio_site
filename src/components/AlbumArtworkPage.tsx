"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import theme from "@/styles/theme";

import HamburgerMenu from "./HamburgerMenu";

import type { MusicPlaylistResult, MusicTrack } from "@/types/music";

const Page = styled.main`
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100svh;
	background: #000;
`;

const Header = styled.header`
	position: sticky;
	top: 0;
	z-index: 30;
	display: flex;
	gap: 1rem 2rem;
	align-items: center;
	justify-content: space-between;
	min-height: 72px;
	padding: 0.75rem 5rem 0.75rem 1rem;
	background: rgb(0 0 0 / 76%);
	backdrop-filter: blur(10px);

	@media (max-width: ${theme.breakpoints.tablet}) {
		flex-direction: column;
		align-items: flex-start;
		padding-right: 4rem;
	}
`;

const Title = styled.h1`
	font-size: clamp(1.25rem, 4vw, 1.75rem);
	line-height: 1.2;
`;

const YouTubeLinks = styled.nav`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem 0.75rem;
	align-items: center;
	font-size: 0.6875rem;

	a {
		color: #fff;
		text-underline-offset: 0.2em;
	}
`;

const YouTubeLogo = styled(Image)`
	width: auto;
	height: 28px;
`;

const ArtworkArea = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;

	body.menu-open & {
		filter: blur(5px);
	}
`;

const Grid = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 2px;
	padding: 2px;
	margin: 0;
	list-style: none;

	@media (max-width: ${theme.breakpoints.mobile}) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

const GridItem = styled.li`
	min-width: 0;
`;

const Tile = styled.button`
	position: relative;
	display: block;
	width: 100%;
	aspect-ratio: 1;
	padding: 0;
	overflow: hidden;
	cursor: pointer;
	background: #171717;
	border: 0;

	&:focus-visible {
		z-index: 1;
		outline: 3px solid #fff;
		outline-offset: -3px;
	}

	&:hover img {
		transform: scale(1.04);
	}

	@media (prefers-reduced-motion: reduce) {
		&:hover img {
			transform: none;
		}
	}
`;

const Artwork = styled(Image)`
	object-fit: cover;
	transition: transform 0.25s ease;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const StatePanel = styled.section`
	display: grid;
	flex: 1;
	place-items: center;
	min-height: 50vh;
	padding: 2rem;
	color: #d4d4d4;
	text-align: center;
`;

const ModalOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	background: rgb(0 0 0 / 82%);
`;

const ModalContent = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	width: min(900px, 100%);
	max-height: calc(100svh - 2rem);
	padding: 3.5rem 1rem 1rem;
	overflow: auto;
	background: #050505;
	border: 1px solid #404040;
	border-radius: 8px;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	width: 2.75rem;
	height: 2.75rem;
	font-size: 2rem;
	line-height: 1;
	color: #fff;
	cursor: pointer;
	background: transparent;
	border: 0;
	border-radius: 4px;

	&:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 2px;
	}
`;

const VideoBox = styled.div`
	width: 100%;
	aspect-ratio: 16 / 9;
	background: #000;

	iframe {
		width: 100%;
		height: 100%;
		border: 0;
	}
`;

const VideoTitle = styled.h2`
	max-width: 70ch;
	margin: 0;
	font-size: clamp(0.875rem, 2vw, 1rem);
	color: #fff;
	text-align: center;
`;

const Footer = styled.footer`
	padding: 0.75rem 1rem;
	font-size: 0.625rem;
	line-height: 1.5;
	color: #bdbdbd;
	text-align: center;
	background: #090909;
`;

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	"iframe",
	'[tabindex]:not([tabindex="-1"])',
].join(",");

export default function AlbumArtworkPage({ playlist }: { playlist: MusicPlaylistResult }) {
	const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);

	const closeModal = useCallback(() => setSelectedTrack(null), []);

	useEffect(() => {
		if (!selectedTrack) return;

		const trigger = triggerRef.current;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				closeModal();
				return;
			}

			if (event.key !== "Tab" || !dialogRef.current) return;
			const focusableElements = Array.from(
				dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
			).filter((element) => !element.hasAttribute("disabled"));
			const firstElement = focusableElements.at(0);
			const lastElement = focusableElements.at(-1);
			if (!firstElement || !lastElement) return;

			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = previousOverflow;
			trigger?.focus();
		};
	}, [closeModal, selectedTrack]);

	const openModal = (track: MusicTrack, trigger: HTMLButtonElement) => {
		triggerRef.current = trigger;
		setSelectedTrack(track);
	};

	const stateMessage =
		playlist.message ??
		(playlist.status === "ready" ? "プレイリストに表示できる動画がありません。" : "");

	return (
		<Page>
			<HamburgerMenu />
			<Header>
				<Title>Favorite Music</Title>
				<YouTubeLinks aria-label="YouTube関連リンク">
					<YouTubeLogo
						alt="Developed with YouTube"
						height={28}
						src="https://developers.google.com/static/youtube/images/developed-with-youtube-sentence-case-light.png"
						unoptimized
						width={128}
					/>
					<a
						href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
						rel="noreferrer"
						target="_blank"
					>
						API TOS
					</a>
					<a href="https://www.youtube.com/t/terms" rel="noreferrer" target="_blank">
						YouTube TOS
					</a>
					<a href="https://policies.google.com/privacy" rel="noreferrer" target="_blank">
						Privacy
					</a>
				</YouTubeLinks>
			</Header>

			<ArtworkArea>
				{playlist.tracks.length > 0 ? (
					<Grid aria-label="お気に入りの音楽">
						{playlist.tracks.map((track) => (
							<GridItem key={track.id}>
								<Tile
									aria-label={`「${track.title}」を再生`}
									onClick={(event) => openModal(track, event.currentTarget)}
									type="button"
								>
									<Artwork
										alt=""
										fill
										sizes="(max-width: 480px) 50vw, (max-width: 640px) 33vw, (max-width: 800px) 25vw, (max-width: 960px) 20vw, (max-width: 1120px) 17vw, (max-width: 1280px) 15vw, 180px"
										src={track.art}
										unoptimized
									/>
								</Tile>
							</GridItem>
						))}
					</Grid>
				) : (
					<StatePanel aria-live="polite" role={playlist.status === "error" ? "alert" : "status"}>
						<p>{stateMessage}</p>
					</StatePanel>
				)}
			</ArtworkArea>

			<Footer>
				This site uses YouTube API Services but is not endorsed or certified by YouTube or Google.
				Thumbnails are streamed directly from YouTube and are not stored or modified.
			</Footer>

			{selectedTrack && (
				<ModalOverlay
					onMouseDown={(event) => {
						if (event.currentTarget === event.target) closeModal();
					}}
					role="presentation"
				>
					<ModalContent
						aria-labelledby="music-dialog-title"
						aria-modal="true"
						ref={dialogRef}
						role="dialog"
					>
						<CloseButton
							aria-label="動画を閉じる"
							onClick={closeModal}
							ref={closeButtonRef}
							type="button"
						>
							&times;
						</CloseButton>
						<VideoBox>
							<iframe
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
								allowFullScreen
								referrerPolicy="strict-origin-when-cross-origin"
								src={`https://www.youtube.com/embed/${selectedTrack.id}`}
								title={`${selectedTrack.title} — YouTube video player`}
							/>
						</VideoBox>
						<VideoTitle id="music-dialog-title">{selectedTrack.title}</VideoTitle>
					</ModalContent>
				</ModalOverlay>
			)}
		</Page>
	);
}
