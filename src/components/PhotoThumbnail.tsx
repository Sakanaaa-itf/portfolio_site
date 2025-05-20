import { styled } from "styled-components";

import type { PhotoMeta } from "@/data/photos";

const PhotoItemContainer = styled.figure<{ $isSquare: boolean }>`
	position: relative;
	width: 100%;
	margin: 0;
	cursor: pointer;
`;

const ImageWrapper = styled.div<{ $isSquare: boolean }>`
	position: relative;
	width: 100%;
	padding-top: ${({ $isSquare }) => ($isSquare ? "100%" : "70%")};
	overflow: hidden;
`;

const StyledImage = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

const FigCaption = styled.figcaption`
	width: 90%;
	margin-top: 0.5rem;
	font-size: 12px;
	color: #ccc;
	text-align: center;
`;

export function PhotoThumbnail({ photo, isSquare }: { isSquare: boolean; photo: PhotoMeta }) {
	return (
		<PhotoItemContainer $isSquare={isSquare}>
			<ImageWrapper $isSquare={isSquare}>
				<StyledImage alt={photo.title} src={photo.lowResUrl} />
			</ImageWrapper>
			{!isSquare && <FigCaption>{photo.title}</FigCaption>}
		</PhotoItemContainer>
	);
}
