"use client";

import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { ramen, RamenMeta } from "@/data/ramen";

const slugify = (str: string) =>
	str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

const makeId = (item: RamenMeta) =>
	slugify(`${item.shop}-${item.name}-${item.date}`);

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

function RamenDetail() {
	const { id } = useParams();
	const [ramenData, setRamenData] = useState<RamenMeta | null>(null);
	const [imgSrc, setImgSrc] = useState<string | null>(null);

	useEffect(() => {
		const found = ramen.find((r) => makeId(r) === id);
		if (found) {
			setRamenData(found);
			setImgSrc(found.lowResUrl);
			const hi = new Image();
			hi.src = found.highResUrl;
			hi.onload = () => setImgSrc(found.highResUrl);
		}
	}, [id]);

	if (!ramenData) return null;

	const { name, shop, location, date } = ramenData;

	return (
		<>
			<DetailWrapper>
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

export default function Ramen() {
	return (
		<Routes>
			<Route index element={<RamenGrid />} />
			<Route path=":id" element={<RamenDetail />} />
		</Routes>
	);
}
