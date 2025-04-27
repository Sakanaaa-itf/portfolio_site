"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import HamburgerMenu from "./HamburgerMenu";

/* ------------- utils ------------- */
function useWindowSize() {
	const [s, set] = useState({ width: 0, height: 0 });
	useEffect(() => {
		const h = () => set({ width: innerWidth, height: innerHeight });
		h();
		addEventListener("resize", h);
		return () => removeEventListener("resize", h);
	}, []);
	return s;
}

interface Track {
	id: string;
	title: string;
	art: string;
}
const fetcher = (u: string) =>
	fetch(u).then((r) => r.json()) as Promise<{ tracks: Track[] }>;

/* ------------- layout ------------- */
const Page = styled.main`
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow-x: hidden;
`;

const Header = styled.header`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	padding: 0 1rem;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(5px);
	z-index: 1001;
	display: flex;
	align-items: center;
	height: 60px;

	@media (max-width: 767px) {
		flex-direction: column;
		height: 90px;
		align-items: flex-start;
	}
`;

const TitleRow = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex: 0 0 60px;
	font-size: 24px;
`;
const NoticeRow = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
	flex: 0 0 30px;
`;

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

const GridContainer = styled.div`
	position: absolute;
	top: 90px;
	@media (min-width: 768px) {
		top: 60px;
	}
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

const Tile = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	cursor: pointer;
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

/* ------------- memo grid ------------- */
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
				<Tile key={t.id} onClick={() => onClick(t.id)}>
					<Image src={t.art} alt={t.title} fill style={{ objectFit: "cover" }} />
				</Tile>
			))}
		</Grid>
	)
);
MemoGrid.displayName = "MemoGrid";

/* ------------- page component ------------- */
export default function AlbumArtworkPage() {
	const { data, error, isLoading } = useSWR("/api/playlist", fetcher);
	const { width } = useWindowSize();

	const tracks = useMemo(() => {
		const l = data?.tracks.filter((t) => t.art) ?? [];
		for (let i = l.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[l[i], l[j]] = [l[j], l[i]];
		}
		return l;
	}, [data]);

	const { cols, rows, tile } = useMemo(() => {
		const N = tracks.length || 1;
		if (width === 0) return { cols: 1, rows: 1, tile: 0 };
		const max = 150,
			min = 100,
			minCols = 5;
		let c = Math.max(minCols, Math.round(Math.sqrt(N * (width / 1080))));
		let t = width / c;
		while (t > max) {
			c++;
			t = width / c;
		}
		while (t < min && c > minCols) {
			c--;
			t = width / c;
		}
		return { cols: c, rows: Math.ceil(N / c), tile: t };
	}, [tracks, width]);

	const [state, setState] = useState<{ displayed: Track[]; remaining: Track[] }>(
		{ displayed: [], remaining: [] }
	);
	useEffect(() => {
		const cnt = cols * rows;
		setState({ displayed: tracks.slice(0, cnt), remaining: tracks.slice(cnt) });
	}, [tracks, cols, rows]);

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const selected = useMemo(
		() => tracks.find((t) => t.id === selectedId) || null,
		[tracks, selectedId]
	);

	const gridEl = useMemo(
		() => (
			<MemoGrid
				displayed={state.displayed}
				cols={cols}
				rows={rows}
				tile={tile}
				onClick={setSelectedId}
			/>
		),
		[state.displayed, cols, rows, tile]
	);

	const modal =
		selected &&
		createPortal(
			<ModalOverlay onClick={() => setSelectedId(null)}>
				<ModalContent onClick={(e) => e.stopPropagation()}>
					<CloseButton onClick={() => setSelectedId(null)}>&times;</CloseButton>
					<VideoContainer>
						<iframe
							src={`https://www.youtube.com/embed/${selected.id}`}
							title={selected.title}
							frameBorder={0}
							allowFullScreen
							style={{ width: "100%", height: "100%" }}
						/>
					</VideoContainer>
					<Title>{selected.title}</Title>
				</ModalContent>
			</ModalOverlay>,
			document.body
		);

	if (isLoading || !tracks.length || error) return null;

	return (
		<Page>
			<Header>
				<TitleRow>
					<HamburgerMenu />
					<span>Favorite&nbsp;Musics</span>
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
							rel="noreferrer"
						>
							API&nbsp;TOS
						</a>
						<a
							href="https://www.youtube.com/t/terms"
							target="_blank"
							rel="noreferrer"
						>
							YouTube&nbsp;TOS
						</a>
						<a
							href="https://policies.google.com/privacy"
							target="_blank"
							rel="noreferrer"
						>
							Privacy
						</a>
					</YTNotice>
				</NoticeRow>
			</Header>

			<GridContainer>
				{gridEl}
				{modal}
			</GridContainer>

			<Footer>
				This site uses YouTube API Services but is not endorsed by YouTube or
				Google.
			</Footer>
		</Page>
	);
}
