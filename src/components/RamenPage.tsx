"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import HamburgerMenu from "@/components/HamburgerMenu";
import { ramen } from "@/data/ramen";
import { sortByDate } from "@/utils/sort";

const Grid = styled.main`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(min(220px, 25%), 1fr));
	gap: 4px;
	min-height: 100vh;
	padding: 4px;
	background: #000;

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
		opacity: 1;
		transform: translateY(0);
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
	color: #fff;
	background: rgba(0, 0, 0, 0.55);
	opacity: 0;
	transform: translateY(100%);
	transition: all 0.3s ease;
`;

export default function RamenList() {
	const sorted = ramen.sort(sortByDate);

	return (
		<>
			<HamburgerMenu />
			<Grid>
				{sorted.map((r) => (
					<Tile href={`/ramen/${r.id}`} key={r.id}>
						<Thumb alt={r.name} fill priority={false} sizes="220px" src={r.lowResUrl} />
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
