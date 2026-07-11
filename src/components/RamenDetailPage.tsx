"use client";

import Image from "next/image";
import styled from "styled-components";

import type { RamenMeta } from "@/data/ramen";

const Page = styled.main`
	max-width: 752px;
	padding: 2rem 1rem 3rem;
	margin: 0 auto;
`;

const Article = styled.article`
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
`;

const Photo = styled.figure`
	margin: 0;
`;

const FullImage = styled(Image)`
	width: 100%;
	height: auto;
	object-fit: contain;
	border-radius: 6px;
`;

const Caption = styled.figcaption`
	margin-top: 1.25rem;
`;

const Title = styled.h1`
	margin: 0 0 0.375rem;
	font-size: clamp(1.25rem, 4vw, 1.75rem);
	font-weight: 700;
`;

const DishName = styled.p`
	margin: 0;
	font-size: 1rem;
	color: #e5e5e5;
`;

const Details = styled.dl`
	display: grid;
	grid-template-columns: max-content minmax(0, 1fr);
	gap: 0.5rem 1rem;
	padding: 1rem;
	margin: 0;
	font-size: 0.875rem;
	background: #111;
	border-radius: 6px;
`;

const DetailTerm = styled.dt`
	font-weight: 700;
	color: #bdbdbd;
`;

const DetailDescription = styled.dd`
	min-width: 0;
	margin: 0;

	address {
		font-style: normal;
	}
`;

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
	dateStyle: "long",
	timeZone: "Asia/Tokyo",
});

export default function RamenDetailPage({ ramen }: { ramen: RamenMeta }) {
	const visitedDate = ramen.date.trim();
	const visitedAt = new Date(`${visitedDate}T00:00:00+09:00`);
	const hasValidVisitedDate = !Number.isNaN(visitedAt.getTime());

	return (
		<Page>
			<Article>
				<Photo>
					<FullImage
						alt={`${ramen.shop}の${ramen.name}`}
						height={1200}
						preload
						sizes="(max-width: 752px) calc(100vw - 32px), 720px"
						src={ramen.highResUrl}
						width={1600}
					/>
					<Caption>
						<Title>{ramen.shop}</Title>
						<DishName>{ramen.name}</DishName>
					</Caption>
				</Photo>

				<Details>
					<DetailTerm>所在地</DetailTerm>
					<DetailDescription>
						<address>{ramen.location}</address>
					</DetailDescription>
					<DetailTerm>訪問日</DetailTerm>
					<DetailDescription>
						{hasValidVisitedDate ? (
							<time dateTime={visitedDate}>{dateFormatter.format(visitedAt)}</time>
						) : (
							"不明"
						)}
					</DetailDescription>
				</Details>
			</Article>
		</Page>
	);
}
