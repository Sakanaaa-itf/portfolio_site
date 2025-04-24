"use client";

import useSWR from "swr";
import Image from "next/image";
import styled from "styled-components";
import { useMemo } from "react";

interface Track {
	id: string;
	title: string;
	art: string;
}

const fetcher = (u: string) =>
	fetch(u).then(async (r) => {
		const json = await r.json();
		if (!r.ok) throw new Error(json.error ?? "API Error");
		return json as { tracks: Track[] };
	});

const Container = styled.main`
	max-width: 1200px;
	margin: 0 auto;
	padding: 1.5rem;
`;

const Title = styled.h1`
	font-size: 2rem;
	font-weight: 600;
	margin-bottom: 1.5rem;
`;

const Grid = styled.div`
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
`;

const Figure = styled.figure`
	position: relative;
	width: 100%;
	aspect-ratio: 1 / 1;
	border-radius: 0.5rem;
	overflow: hidden;
`;

const Message = styled.p`
	text-align: center;
	margin-top: 1rem;
`;

export default function AlbumArtworkPage() {
	const { data, error, isLoading } = useSWR("/api/playlist", fetcher, {
		revalidateOnFocus: false,
	});

	const gallery = useMemo(() => {
		if (error) return <Message>{error.message}</Message>;
		if (isLoading || !data) return <Message>Loading…</Message>;

		const tracks = data.tracks ?? [];
		if (tracks.length === 0) return <Message>No tracks found.</Message>;

		return (
			<Grid>
				{tracks.map((t) => (
					<Figure key={t.id}>
						<Image
							src={t.art}
							alt={t.title}
							fill
							sizes="160px"
							style={{ objectFit: "cover" }}
						/>
					</Figure>
				))}
			</Grid>
		);
	}, [data, error, isLoading]);

	return (
		<Container>
			<Title>Playlist Artwork Gallery</Title>
			{gallery}
		</Container>
	);
}
