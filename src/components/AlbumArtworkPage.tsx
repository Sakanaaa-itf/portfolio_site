"use client";

import Image from "next/image";
import React, { useState, useEffect, useMemo, memo } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import useSWR from "swr";

import theme from "@/styles/theme";

import HamburgerMenu from "./HamburgerMenu";

function useWindowSize() {
	const [s, set] = useState({ height: 0, width: 0 });
	useEffect(() => {
		const h = () => set({ height: innerHeight, width: innerWidth });
		h();
		addEventListener("resize", h);
		return () => removeEventListener("resize", h);
	}, []);
	return s;
}

interface Track {
	art: string;
	id: string;
	title: string;
}
const fetcher = (u: string) => fetch(u).then((r) => r.json()) as Promise<{ tracks: Track[] }>;

const Page = styled.main`
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow-x: hidden;
`;

const Header = styled.header`
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	z-index: 1001;
	display: flex;
	align-items: center;
	height: 60px;
	padding: 0 1rem;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: blur(5px);

	@media (max-width: ${theme.breakpoints.mobile}) {
		flex-direction: column;
		align-items: flex-start;
		height: 90px;
	}
`;

const TitleRow = styled.div`
	display: flex;
	flex: 0 0 60px;
	gap: 0.5rem;
	align-items: center;
	font-size: 24px;
`;
const NoticeRow = styled.div`
	display: flex;
	gap: 0.5rem;
	align-items: center;
	font-size: 11px;
`;

const YTNotice = styled.div`
	display: flex;
	gap: 0.5rem;
	align-items: center;
	img {
		height: 60px;
		@media (max-width: ${theme.breakpoints.mobile}) {
			height: 30px;
		}
	}
	a {
		font-size: 11px;
		color: #fff;
	}
`;

const GridContainer = styled.div`
	position: absolute;
	top: 60px;
	right: 0;
	bottom: 0;
	left: 0;
	overflow: hidden;
	@media (max-width: ${theme.breakpoints.mobile}) {
		top: 90px;
	}
	body.menu-open & {
		filter: blur(5px);
	}
`;

const Grid = styled.div`
	display: grid;
	grid-template-rows: repeat(var(--rows), var(--tile));
	grid-template-columns: repeat(var(--cols), var(--tile));
	gap: 0;
	width: 100%;
	height: 100%;
`;

const Tile = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	cursor: pointer;
`;

const ModalOverlay = styled.div`
	position: fixed;
	inset: 0;
	z-index: 1100;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.7);
`;
const ModalContent = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	align-items: center;
	padding: 1rem;
	background: #000;
`;
const CloseBtn = styled.button`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	font-size: 1.5rem;
	color: #fff;
	cursor: pointer;
	background: transparent;
	border: none;
`;
const VideoBox = styled.div`
	width: 80vw;
	max-width: 800px;
	aspect-ratio: 16/9;
	background: #000;
`;
const VideoTitle = styled.p`
	max-width: 80vw;
	margin: 0;
	font-size: 14px;
	color: #fff;
	text-align: center;
`;

const Footer = styled.footer`
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 0;
	font-size: 6px;
	line-height: 10px;
	color: #fff;
	text-align: center;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(4px);
`;

const MemoGrid = memo(
	({
		displayed,
		cols,
		rows,
		tile,
		onSelect,
	}: {
		cols: number;
		displayed: Track[];
		onSelect(id: string): void;
		rows: number;
		tile: number;
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
				<Tile key={t.id} onClick={() => onSelect(t.id)}>
					<Image alt={t.title} fill src={t.art} style={{ objectFit: "cover" }} unoptimized />
				</Tile>
			))}
		</Grid>
	),
);
MemoGrid.displayName = "MemoGrid";

export default function AlbumArtworkPage() {
	const { data } = useSWR("/api/playlist", fetcher, {
		revalidateOnFocus: false,
	});
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
		if (!width) return { cols: 1, rows: 1, tile: 0 };
		const N = tracks.length || 1,
			minCols = 5,
			max = 150,
			min = 100;
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

	const [displayed, setDisplayed] = useState<Track[]>([]);
	useEffect(() => {
		setDisplayed(tracks.slice(0, cols * rows));
	}, [tracks, cols, rows]);

	const [selId, setSelId] = useState<string | null>(null);
	const selected = useMemo(() => tracks.find((t) => t.id === selId) || null, [tracks, selId]);

	if (!tracks.length) return null;

	return (
		<Page>
			<Header>
				<TitleRow>
					<HamburgerMenu />
					<span>Favorite&nbsp;Musics</span>
				</TitleRow>
				<NoticeRow>
					<YTNotice>
						{/* eslint-disable-next-line @next/next/no-img-element*/}
						<img
							alt="Developed with YouTube"
							src="https://developers.google.com/static/youtube/images/developed-with-youtube-sentence-case-light.png"
						/>
						<a
							href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
							rel="noreferrer"
							target="_blank"
						>
							API&nbsp;TOS
						</a>
						<a href="https://www.youtube.com/t/terms" rel="noreferrer" target="_blank">
							YouTube&nbsp;TOS
						</a>
						<a href="https://policies.google.com/privacy" rel="noreferrer" target="_blank">
							Privacy
						</a>
					</YTNotice>
				</NoticeRow>
			</Header>

			<GridContainer>
				<MemoGrid cols={cols} displayed={displayed} onSelect={setSelId} rows={rows} tile={tile} />
				{selected &&
					createPortal(
						<ModalOverlay onClick={() => setSelId(null)}>
							<ModalContent onClick={(e) => e.stopPropagation()}>
								<CloseBtn onClick={() => setSelId(null)}>&times;</CloseBtn>
								<VideoBox>
									<iframe
										allowFullScreen
										frameBorder={0}
										src={`https://www.youtube.com/embed/${selected.id}`}
										style={{ height: "100%", width: "100%" }}
										title={selected.title}
									/>
								</VideoBox>
								<VideoTitle>{selected.title}</VideoTitle>
							</ModalContent>
						</ModalOverlay>,
						document.body,
					)}
			</GridContainer>

			<Footer>
				This site uses YouTube API Services but is not endorsed or certified by YouTube or Google.
				Thumbnails are streamed directly from YouTube and are not stored or modified.
			</Footer>
		</Page>
	);
}
