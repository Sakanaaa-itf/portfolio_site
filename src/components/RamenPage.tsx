"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import HamburgerMenu from "@/components/HamburgerMenu";
import { ramen } from "@/data/ramen";
import theme from "@/styles/theme";
import { sortByDate } from "@/utils/sort";

import type { Route } from "next";

const Page = styled.main`
	min-height: 100svh;
	padding: 4px;
	background: #000;

	body.menu-open & {
		filter: blur(5px);
	}
`;

const PageTitle = styled.h1`
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	white-space: nowrap;
	border: 0;
	clip-path: inset(50%);
`;

const Grid = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 4px;
	margin: 0;
	list-style: none;

	@media (max-width: ${theme.breakpoints.tablet}) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
`;

const GridItem = styled.li`
	min-width: 0;
`;

const Tile = styled(Link)`
	position: relative;
	display: block;
	aspect-ratio: 1;
	overflow: hidden;
	background: #171717;

	&:hover img {
		transform: scale(1.05);
	}

	&:hover [data-overlay],
	&:focus-visible [data-overlay] {
		opacity: 1;
		transform: translateY(0);
	}

	&:focus-visible {
		z-index: 1;
		outline: 3px solid #fff;
		outline-offset: -3px;
	}

	@media (prefers-reduced-motion: reduce) {
		&:hover img {
			transform: none;
		}
	}
`;

const Thumbnail = styled(Image)`
	object-fit: cover;
	transition: transform 0.35s ease;

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const Overlay = styled.div`
	position: absolute;
	inset: auto 0 0;
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
	padding: 0.5rem;
	font-size: 0.75rem;
	color: #fff;
	pointer-events: none;
	background: rgb(0 0 0 / 68%);
	opacity: 0;
	transform: translateY(100%);
	transition:
		opacity 0.25s ease,
		transform 0.25s ease;

	@media (hover: none) {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

const ShopName = styled.span`
	font-weight: 700;
`;

const DishName = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const sortedRamen = [...ramen].sort(sortByDate);

export default function RamenList() {
	return (
		<>
			<HamburgerMenu />
			<Page>
				<PageTitle>Ramen</PageTitle>
				<Grid aria-label="ラーメン一覧">
					{sortedRamen.map((item) => (
						<GridItem key={item.id}>
							<Tile href={`/ramen/${item.id}` as Route}>
								<Thumbnail
									alt={`${item.shop}の${item.name}`}
									fill
									sizes="(max-width: 480px) 50vw, (max-width: 884px) 33vw, (max-width: 1104px) 25vw, (max-width: 1328px) 20vw, (max-width: 1548px) 17vw, 240px"
									src={item.lowResUrl}
								/>
								<Overlay data-overlay>
									<ShopName>{item.shop}</ShopName>
									<DishName>{item.name}</DishName>
								</Overlay>
							</Tile>
						</GridItem>
					))}
				</Grid>
			</Page>
		</>
	);
}
