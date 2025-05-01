"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { PhotoMeta } from "@/data/photos";
import { getExifDataForPhoto, type ExifData } from "@/utils/photoUtils";
import { useDevice } from "@/hooks/useDevice";

const Wrapper = styled.div<{ $isMobile: boolean }>`
	display: flex;
	flex-direction: ${({ $isMobile }) => ($isMobile ? "column" : "row")};
	gap: 2rem;
	align-items: flex-start;
`;

const CommentBox = styled.div`
	min-width: 230px;
	font-size: 14px;
	line-height: 1.6;
`;

const ExifBox = styled.div<{ $isMobile: boolean }>`
	display: flex;
	flex-direction: ${({ $isMobile }) => ($isMobile ? "column" : "row")};
	gap: 1.5rem;
	font-size: 12px;
	line-height: 1.4;
	border-left: 1px solid #ddd;
	padding-left: 1rem;
	max-width: 80vw;
`;

const ExifColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
`;

const ExifLine = styled.p`
	margin: 0;
	white-space: nowrap;
`;

const LinkText = styled.a`
	color: #1da1f2;
	&:hover {
		opacity: 0.8;
	}
`;

const ShareBtn = styled.a`
	display: inline-block;
	margin-top: 1.5rem;
	padding: 0.5rem 1rem;
	font-size: 12px;
	background-color: #1da1f2;
	color: #fff;
	border-radius: 4px;
	text-decoration: none;
	&:hover {
		opacity: 0.8;
	}
`;

function formatText(text: string) {
	return text.split("\n").map((line, i) => (
		<span key={i}>
			{line.split(/(https?:\/\/[^\s]+)/g).map((part, j) =>
				/(https?:\/\/[^\s]+)/.test(part) ? (
					<LinkText key={j} href={part} target="_blank" rel="noopener noreferrer">
						{part}
					</LinkText>
				) : (
					part
				)
			)}
			{i !== text.length - 1 && <br />}
		</span>
	));
}

export default function PhotoDetailInfo({ photo }: { photo: PhotoMeta }) {
	const { isMobile } = useDevice();
	const [exif, setExif] = useState<ExifData | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await getExifDataForPhoto(photo);
				if (!cancelled) setExif(data);
			} catch {
				// ignore
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [photo]);

	const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		`Check out this photo: "${photo.title}" \n`
	)}&url=${encodeURIComponent(
		`https://xn--19ja1fb.xn--q9jyb4c/photoworks/${photo.id}`
	)}`;

	return (
		<Wrapper $isMobile={isMobile}>
			<CommentBox>{formatText(photo.comment)}</CommentBox>

			<ExifBox $isMobile={isMobile}>
				<ExifColumn>
					<ExifLine>Date&nbsp;:&nbsp;{exif?.dateTime || "-"}</ExifLine>
					<ExifLine>Camera&nbsp;:&nbsp;{exif?.cameraModel || "-"}</ExifLine>
					<ExifLine>Lens&nbsp;:&nbsp;{exif?.lensModel || "-"}</ExifLine>
				</ExifColumn>
				<ExifColumn>
					<ExifLine>Aperture&nbsp;:&nbsp;{exif?.aperture || "-"}</ExifLine>
					<ExifLine>SS&nbsp;:&nbsp;{exif?.shutterSpeed || "-"}</ExifLine>
					<ExifLine>ISO&nbsp;:&nbsp;{exif?.iso || "-"}</ExifLine>
					<ExifLine>
						Focal&nbsp;Length&nbsp;:&nbsp;{exif?.focalLength || "-"}
					</ExifLine>
				</ExifColumn>
			</ExifBox>

			<ShareBtn href={shareUrl} target="_blank" rel="noopener noreferrer">
				share to Twitter
			</ShareBtn>
		</Wrapper>
	);
}
