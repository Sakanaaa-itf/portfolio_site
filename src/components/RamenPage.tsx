/*
  Ramen.tsx – updated for new RamenMeta shape (lowResUrl / highResUrl)
  ------------------------------------------------------------------
  Displays a full‑screen grid of square ramen photos. Each tile shows the
  ramen name and its location. Clicking navigates to /ramen/:id where a
  detail page progressively swaps the low‑res image for the high‑res
  version and injects OGP meta tags (react‑helmet‑async).
*/

"use client";

import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { ramen, RamenMeta } from "@/data/ramen";
import HamburgerMenu from "./HamburgerMenu";

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

const slugify = (str: string) =>
	str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

const makeId = (item: RamenMeta) =>
	slugify(`${item.shop}-${item.name}-${item.date}`);

// ────────────────────────────────────────────────────────────────
// Styled Components
// ────────────────────────────────────────────────────────────────

const GridWrapper = styled.div`
	width: 100%;
	min-height: 100vh;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 4px;
	background: #111;
`;

const Tile = styled(Link)`
	position: relative;
	width: 100%;
	aspect-ratio: 1 / 1;
	overflow: hidden;
	cursor: pointer;
	&:hover .overlay {
		opacity: 1;
		transform: translateY(0);
	}
`;

const ThumbImg = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.4s ease;
	${Tile}:hover & {
		transform: scale(1.05);
	}
`;

const Overlay = styled.div`
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	background: rgba(0, 0, 0, 0.55);
	color: #fff;
	font-size: 12px;
	padding: 6px;
	opacity: 0;
	transform: translateY(100%);
	transition: all 0.3s ease;
`;

const DetailWrapper = styled.div`
	max-width: 960px;
	margin: 0 auto;
	padding: 2rem 1rem;
`;

const FullImg = styled.img`
	width: 100%;
	max-height: 70vh;
	object-fit: contain;
	display: block;
	margin: 0 auto;
`;

const Meta = styled.div`
	margin-top: 1rem;
	font-size: 14px;
	line-height: 1.5;
`;

const BackBtn = styled.button`
	background: none;
	border: none;
	color: #1da1f2;
	font-size: 14px;
	cursor: pointer;
	margin-bottom: 1rem;
`;

// ────────────────────────────────────────────────────────────────
// Thumbnail component
// ────────────────────────────────────────────────────────────────

function RamenThumbnail({ item }: { item: RamenMeta }) {
	const id = makeId(item);
	return (
		<Tile to={id} state={{ ramen: item }}>
			<ThumbImg src={item.lowResUrl} alt={item.name} loading="lazy" />
			<Overlay className="overlay">
				<strong>{item.shop}</strong>
				<br />
				{item.name}
			</Overlay>
		</Tile>
	);
}

// ────────────────────────────────────────────────────────────────
// Grid list component
// ────────────────────────────────────────────────────────────────

function RamenGrid() {
	// newest first
	const sorted = [...ramen].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);
	return (
		<GridWrapper>
			{sorted.map((item) => (
				<RamenThumbnail key={makeId(item)} item={item} />
			))}
		</GridWrapper>
	);
}

// ────────────────────────────────────────────────────────────────
// Detail page component
// ────────────────────────────────────────────────────────────────

function RamenDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [ramenData, setRamenData] = useState<RamenMeta | null>(null);
	const [imgSrc, setImgSrc] = useState<string | null>(null);

	useEffect(() => {
		const found = ramen.find((r) => makeId(r) === id);
		if (found) {
			setRamenData(found);
			setImgSrc(found.lowResUrl);
			// progressive swap to high‑res
			const hi = new Image();
			hi.src = found.highResUrl;
			hi.onload = () => setImgSrc(found.highResUrl);
		}
	}, [id]);

	if (!ramenData) return null;

	const { name, shop, location, date, highResUrl } = ramenData;

	return (
		<>
			{/* OGP meta tags */}
			<Helmet>
				<title>{`${name} | ${shop}`}</title>
				<meta name="description" content={`${location} – ${name}`} />
				<meta property="og:type" content="article" />
				<meta property="og:title" content={`${name} | ${shop}`} />
				<meta property="og:description" content={`${location} – ${name}`} />
				<meta property="og:image" content={highResUrl} />
				<meta property="og:url" content={`https://example.com/ramen/${id}`} />
				<meta name="twitter:card" content="summary_large_image" />
			</Helmet>

			<DetailWrapper>
				<BackBtn onClick={() => navigate(-1)}>← Back</BackBtn>
				{imgSrc && <FullImg src={imgSrc} alt={name} />}
				<Meta>
					<p>
						<strong>{shop}</strong>
					</p>
					<p>{name}</p>
					<p>{location}</p>
					<p>Visited: {new Date(date).toLocaleDateString()}</p>
				</Meta>
			</DetailWrapper>
		</>
	);
}

// ────────────────────────────────────────────────────────────────
// Main exported component
// ────────────────────────────────────────────────────────────────

export default function Ramen() {
	return (
		<>
			<HamburgerMenu />
			<Routes>
				<Route index element={<RamenGrid />} />
				<Route path=":id" element={<RamenDetail />} />
			</Routes>
		</>
	);
}
