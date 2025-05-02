"use client";

import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { ramen } from "@/data/ramen";
import HamburgerMenu from "@/components/HamburgerMenu";

const Grid = styled.main`
	display: grid;
	min-height: 100vh;
	grid-template-columns: repeat(auto-fill, minmax(min(220px, 25%), 1fr));
	gap: 4px;
	background: #000;
	padding: 4px;

	body.menu-open & {
		filter: blur(5px);
	}
`;

const Tile = styled(Link)`
	position: relative;
	aspect-ratio: 1/1;
	overflow: hidden;

	&:hover img {
		transform: scale(1.05);
	}
	&:hover .overlay {
		transform: translateY(0);
		opacity: 1;
	}
`;

const Thumb = styled(Image)`
	object-fit: cover;
	transition: transform 0.35s ease;
`;

const Overlay = styled.div`
	position: absolute;
	inset: auto 0 0 0;
	padding: 6px;
	font-size: 10px;
	background: rgba(0, 0, 0, 0.55);
	color: #fff;
	transform: translateY(100%);
	opacity: 0;
	transition: all 0.3s ease;
`;

export default function RamenPage() {
	const sorted = [...ramen].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	return (
		<>
			<HamburgerMenu />
			<Grid>
				{sorted.map((r) => (
					<Tile key={r.id} href={`/ramen/${r.id}`}>
						<Thumb
							src={r.lowResUrl}
							alt={r.name}
							fill
							sizes="220px"
							priority={false}
						/>
						<Overlay className="overlay">
							<strong>{r.shop}</strong>
							<br />
							{r.name}
						</Overlay>
					</Tile>
				))}
			</Grid>
		</>
	);
}
