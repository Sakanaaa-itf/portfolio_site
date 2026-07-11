import Image from "next/image";
import styled from "styled-components";

import type { PhotoMeta } from "@/data/photos";

const PhotoItemContainer = styled.figure`
	position: relative;
	width: 100%;
	margin: 0;
`;

const ImageWrapper = styled.div<{ $isSquare: boolean }>`
	position: relative;
	width: 100%;
	aspect-ratio: ${({ $isSquare }) => ($isSquare ? "1" : "10 / 7")};
	overflow: hidden;
	background: #111;
`;

const StyledImage = styled(Image)`
	object-fit: cover;
	transition: transform 0.3s ease;

	${PhotoItemContainer}:hover & {
		transform: scale(1.02);
	}
`;

const FigCaption = styled.figcaption`
	width: 90%;
	margin-top: 0.5rem;
	margin-right: auto;
	margin-left: auto;
	font-size: 12px;
	color: #ccc;
	text-align: center;
`;

export function PhotoThumbnail({ photo, isSquare }: { isSquare: boolean; photo: PhotoMeta }) {
	const sizes = isSquare
		? "(max-width: 768px) 50vw, (max-width: 960px) 33vw, (max-width: 1200px) 25vw, 240px"
		: "(max-width: 440px) 100vw, (max-width: 700px) 50vw, (max-width: 960px) 33vw, (max-width: 1200px) 25vw, 240px";

	return (
		<PhotoItemContainer>
			<ImageWrapper $isSquare={isSquare}>
				<StyledImage alt={photo.title} fill loading="lazy" sizes={sizes} src={photo.lowResUrl} />
			</ImageWrapper>
			{!isSquare && <FigCaption>{photo.title}</FigCaption>}
		</PhotoItemContainer>
	);
}
