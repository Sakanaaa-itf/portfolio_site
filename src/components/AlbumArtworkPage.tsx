"use client";

import React, { useState, useEffect, useMemo, memo } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import HamburgerMenu from "./HamburgerMenu";

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
	align-items: center;
	gap: 0.5rem;
	font-size: 11px;
`;

const YTNotice = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	img {
		height: 60px;
		@media (max-width: 767px) {
			height: 30px;
		}
	}
	a {
		color: #fff;
		font-size: 11px;
	}
`;

const GridContainer = styled.div`
	position: absolute;
	top: 60px;
	@media (max-width: 767px) {
		top: 90px;
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

const ModalOverlay = styled.div`
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1100;
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
const CloseBtn = styled.button`
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
	background: transparent;
	border: none;
	color: #fff;
	font-size: 1.5rem;
	cursor: pointer;
`;
const VideoBox = styled.div`
	width: 80vw;
	max-width: 800px;
	aspect-ratio: 16/9;
	background: #000;
`;
const VideoTitle = styled.p`
	color: #fff;
	margin: 0;
	text-align: center;
	max-width: 80vw;
	font-size: 14px;
`;

const Footer = styled.footer`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 0;
	line-height: 10px;
	background: rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(4px);
	text-align: center;
	font-size: 6px;
	color: #fff;
`;

const MemoGrid = memo(
	({
		displayed,
		cols,
		rows,
		tile,
		onSelect,
	}: {
		displayed: Track[];
		cols: number;
		rows: number;
		tile: number;
		onSelect(id: string): void;
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
					<Image src={t.art} alt={t.title} fill style={{ objectFit: "cover" }} />
				</Tile>
			))}
		</Grid>
	)
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
	const selected = useMemo(
		() => tracks.find((t) => t.id === selId) || null,
		[tracks, selId]
	);

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
				<MemoGrid
					displayed={displayed}
					cols={cols}
					rows={rows}
					tile={tile}
					onSelect={setSelId}
				/>
				{selected &&
					createPortal(
						<ModalOverlay onClick={() => setSelId(null)}>
							<ModalContent onClick={(e) => e.stopPropagation()}>
								<CloseBtn onClick={() => setSelId(null)}>&times;</CloseBtn>
								<VideoBox>
									<iframe
										src={`https://www.youtube.com/embed/${selected.id}`}
										title={selected.title}
										frameBorder={0}
										allowFullScreen
										style={{ width: "100%", height: "100%" }}
									/>
								</VideoBox>
								<VideoTitle>{selected.title}</VideoTitle>
							</ModalContent>
						</ModalOverlay>,
						document.body
					)}
			</GridContainer>

			<Footer>
				This site uses YouTube API Services but is not endorsed or certified by
				YouTube or Google. Thumbnails are streamed directly from YouTube and are not
				stored or modified.
			</Footer>
		</Page>
	);
}
