"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import HamburgerMenu from "./HamburgerMenu";

function useWindowSize() {
	const [size, setSize] = useState({ width: 0, height: 0 });
	useEffect(() => {
		const onResize = () =>
			setSize({ width: window.innerWidth, height: window.innerHeight });
		onResize();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
	return size;
}

interface Track {
	id: string;
	title: string;
	art: string;
}

const fetcher = async (url: string) => {
	const res = await fetch(url);
	const json = await res.json();
	if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
	return json as { tracks: Track[] };
};

const Page = styled.main`
	position: relative;
	width: 100vw;
	height: 200vh;
	overflow-x: hidden;
`;

/* ── Header全体を縦並びにし、上段: タイトル行、下段: YTNotice 行 ── */
const Header = styled.header`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 90px; /* 60px → 90px (2段分) */
	padding: 0 1rem;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(5px);
	z-index: 1001;

	display: flex;
	flex-direction: column; /* ← 縦並びに変更 */
	justify-content: center;
`;

/* タイトル行用ラッパー（上段） */
const TitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex: 0 0 60px; /* 高さ 60px 固定 */
`;

/* YTNotice はそのまま使うが、下段に配置するため余白を調整 */
const NoticeRow = styled.div`
	display: flex;
	justify-content: flex-end; /* 右寄せ */
	align-items: center;
	gap: 0.5rem;
	flex: 0 0 30px; /* 高さ 30px */
`;

/* 既存 YTNotice スタイルを適用 */
const YTNotice = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	img {
		height: 18px;
	}
	a {
		color: #fff;
		font-size: 11px;
	}
`;

/* GridContainer の top をヘッダー高に合わせて 90px へ */
const GridContainer = styled.div`
	position: absolute;
	top: 90px; /* ← 変更 */
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	body.menu-open & {
		filter: blur(5px);
	}
`;

const Grid = styled.div`
	display: grid;
	width: 100%;
	height: 100%;
	gap: 0;
	grid-template-columns: repeat(var(--cols), var(--tile));
	grid-template-rows: repeat(var(--rows), var(--tile));
`;

const TileWrapper = styled.div`
	perspective: 800px;
	cursor: pointer;
`;

const flipAnim = keyframes`
  0%   { transform: rotateY(0deg); }
  49%  { transform: rotateY(90deg); }
  51%  { transform: rotateY(90deg); }
  100% { transform: rotateY(180deg); }
`;

const FlipCard = styled.div<{ $flipping: boolean }>`
	width: var(--tile);
	height: var(--tile);
	transform-style: preserve-3d;
	animation: ${({ $flipping }) => ($flipping ? flipAnim : "none")} 0.8s
		ease-in-out;
`;

const Face = styled.div`
	backface-visibility: hidden;
	position: absolute;
	width: 100%;
	height: 100%;
`;

const FrontFace = styled(Face)`
	transform: rotateY(0deg);
`;

const BackFace = styled(Face)`
	transform: rotateY(180deg);
`;

const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
`;

const ModalContent = styled.div`
	background: #000;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	position: relative;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background: transparent;
	border: none;
	color: #fff;
	font-size: 1.5rem;
	cursor: pointer;
`;

const VideoContainer = styled.div`
	width: 80vw;
	max-width: 800px;
	aspect-ratio: 16/9;
	background: #000;
`;

const Title = styled.p`
	color: #fff;
	margin: 0;
	text-align: center;
	max-width: 80vw;
`;

const Footer = styled.footer`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 0.25rem 0;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(4px);
	text-align: center;
	font-size: 11px;
	color: #fff;
`;

const FlipTile = memo(
	({ track, onClick }: { track: Track; onClick(id: string): void }) => {
		const [front, setFront] = useState(track);
		const [back, setBack] = useState<Track | null>(null);
		const [flipping, setFlip] = useState(false);
		useEffect(() => {
			if (track.id === front.id) return;
			setBack(track);
			setFlip(true);
			const mid = setTimeout(() => setFront(track), 400);
			const end = setTimeout(() => setFlip(false), 800);
			return () => {
				clearTimeout(mid);
				clearTimeout(end);
			};
		}, [track, front]);
		return (
			<TileWrapper onClick={() => onClick(track.id)}>
				<FlipCard $flipping={flipping}>
					<FrontFace>
						<Image
							src={front.art}
							alt={front.title}
							fill
							style={{ objectFit: "cover" }}
						/>
					</FrontFace>
					{back && (
						<BackFace>
							<Image
								src={back.art}
								alt={back.title}
								fill
								style={{ objectFit: "cover" }}
							/>
						</BackFace>
					)}
				</FlipCard>
			</TileWrapper>
		);
	}
);
FlipTile.displayName = "FlipTile";

const MemoGrid = memo(
	({
		displayed,
		cols,
		rows,
		tile,
		onClick,
	}: {
		displayed: Track[];
		cols: number;
		rows: number;
		tile: number;
		onClick(id: string): void;
	}) => (
		<Grid
			style={
				{
					"--cols": cols,
					"--rows": rows,
					"--tile": `${tile}px`,
				} as React.CSSProperties
			}
		>
			{displayed.map((t) => (
				<FlipTile key={t.id} track={t} onClick={onClick} />
			))}
		</Grid>
	)
);
MemoGrid.displayName = "MemoGrid";

export default function AlbumArtworkPage() {
	const { data, error, isLoading } = useSWR("/api/playlist", fetcher, {
		revalidateOnFocus: false,
	});
	const { width, height } = useWindowSize();

	const tracks = useMemo(() => {
		const list = data?.tracks.filter((t) => t.art) || [];
		for (let i = list.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[list[i], list[j]] = [list[j], list[i]];
		}
		return list;
	}, [data]);

	const { cols, rows, tile } = useMemo(() => {
		const N = tracks.length || 1;
		if (width === 0 || height === 0) return { cols: 1, rows: 1, tile: 0 };

		const maxTile = 150;
		const minTile = 100;
		const minCols = 5;

		let c = Math.max(minCols, Math.round(Math.sqrt(N * (width / height))));
		let t = width / c;

		while (t > maxTile) {
			c++;
			t = width / c;
		}
		while (t < minTile && c > minCols) {
			c--;
			t = width / c;
		}

		const r = Math.ceil(N / c);
		return { cols: c, rows: r, tile: t };
	}, [tracks, width, height]);

	const [state, setState] = useState<{ displayed: Track[]; remaining: Track[] }>(
		{
			displayed: [],
			remaining: [],
		}
	);

	useEffect(() => {
		const count = cols * rows;
		setState({
			displayed: tracks.slice(0, count),
			remaining: tracks.slice(count),
		});
	}, [tracks, cols, rows]);

	useEffect(() => {
		if (!state.remaining.length) return;
		const iv = setInterval(() => {
			setState((prev) => {
				const d = [...prev.displayed];
				const r = [...prev.remaining];
				const di = Math.floor(Math.random() * d.length);
				const ri = Math.floor(Math.random() * r.length);
				[d[di], r[ri]] = [r[ri], d[di]];
				return { displayed: d, remaining: r };
			});
		}, 5000);
		return () => clearInterval(iv);
	}, [state.remaining.length]);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected = useMemo(
		() => tracks.find((t) => t.id === selectedId) || null,
		[tracks, selectedId]
	);
	const handleSelect = useCallback((id: string) => setSelectedId(id), []);
	const handleClose = useCallback(() => setSelectedId(null), []);

	const grid = useMemo(
		() => (
			<MemoGrid
				displayed={state.displayed}
				cols={cols}
				rows={rows}
				tile={tile}
				onClick={handleSelect}
			/>
		),
		[state.displayed, cols, rows, tile, handleSelect]
	);

	const modal =
		selected &&
		createPortal(
			<ModalOverlay onClick={handleClose}>
				<ModalContent onClick={(e) => e.stopPropagation()}>
					<CloseButton onClick={handleClose}>&times;</CloseButton>
					<VideoContainer>
						<iframe
							src={`https://www.youtube.com/embed/${selected.id}`}
							title={selected.title}
							frameBorder="0"
							allowFullScreen
							style={{ width: "100%", height: "100%" }}
						/>
					</VideoContainer>
					<Title>{selected.title}</Title>
				</ModalContent>
			</ModalOverlay>,
			document.body
		);

	if (isLoading || !tracks.length) return null;
	if (error) return null;

	return (
		<Page>
			<Header>
				<TitleRow>
					<HamburgerMenu />
					<Title>Music</Title>
				</TitleRow>

				<NoticeRow>
					<YTNotice>
						<img
							src="https://developers.google.com/static/youtube/images/developed-with-youtube-sentence-case-light.png"
							alt="Developed with YouTube"
						/>
						<a
							href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
							target="_blank"
							rel="noopener noreferrer"
						>
							API TOS
						</a>
						<a
							href="https://www.youtube.com/t/terms"
							target="_blank"
							rel="noopener noreferrer"
						>
							YouTube TOS
						</a>
						<a
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noopener noreferrer"
						>
							Privacy Policy
						</a>
					</YTNotice>
				</NoticeRow>
			</Header>
			<GridContainer>
				{grid}
				{modal}
			</GridContainer>
			<Footer>
				This site uses YouTube API Services but is not endorsed or certified by
				YouTube or Google. Thumbnails are streamed directly from YouTube and are not
				stored or modified.
			</Footer>
		</Page>
	);
}
