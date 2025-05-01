"use client";

import Image from "next/image";
import styled from "styled-components";
import type { RamenMeta } from "@/data/ramen";

const Wrapper = styled.main`
	max-width: 720px;
	margin: 0 auto;
	padding: 32px 16px;
`;
const FullImg = styled(Image)`
	width: 100%;
	height: auto;
	object-fit: contain;
	border-radius: 6px;
`;
const Title = styled.h1`
	margin: 24px 0 8px;
	font-size: 20px;
	font-weight: 700;
`;
const Text = styled.p`
	margin: 2px 0;
	font-size: 14px;
`;

export default function RamenDetailPage({ ramen }: { ramen: RamenMeta }) {
	return (
		<Wrapper>
			<FullImg
				src={ramen.highResUrl}
				alt={ramen.name}
				width={1600}
				height={1200}
				priority
			/>
			<Title>{ramen.shop}</Title>
			<Text>{ramen.name}</Text>
			<Text>{ramen.location}</Text>
			<Text>Visited: {new Date(ramen.date).toLocaleDateString()}</Text>
		</Wrapper>
	);
}
