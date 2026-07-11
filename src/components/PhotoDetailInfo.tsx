"use client";

import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";

import theme from "@/styles/theme";
import { getExifDataForPhoto, type ExifData } from "@/utils/photoUtils";

import type { PhotoMeta } from "@/data/photos";

const Wrapper = styled.section`
	display: grid;
	grid-template-columns: minmax(230px, 1fr) minmax(320px, 2fr) auto;
	gap: 2rem;
	align-items: start;

	@media (max-width: ${theme.breakpoints.tablet}) {
		grid-template-columns: minmax(0, 1fr);
		gap: 1.5rem;
	}
`;

const CommentText = styled.p`
	margin: 0;
	font-size: 14px;
	line-height: 1.6;
`;

const ExifRegion = styled.div`
	min-width: 0;
`;

const ExifList = styled.dl`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.5rem 1.5rem;
	padding-left: 1rem;
	margin: 0;
	font-size: 12px;
	line-height: 1.4;
	border-left: 1px solid #ddd;

	@media (max-width: ${theme.breakpoints.tablet}) {
		padding-top: 1rem;
		padding-left: 0;
		border-top: 1px solid #ddd;
		border-left: 0;
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		grid-template-columns: minmax(0, 1fr);
	}
`;

const ExifItem = styled.div<{ $column: 1 | 2 }>`
	display: grid;
	grid-template-columns: max-content minmax(0, 1fr);
	grid-column: ${({ $column }) => $column};
	gap: 0.35rem;

	@media (max-width: ${theme.breakpoints.mobile}) {
		grid-column: 1;
	}
`;

const ExifTerm = styled.dt`
	&::after {
		content: ":";
	}
`;

const ExifValue = styled.dd`
	min-width: 0;
	margin: 0;
	overflow-wrap: anywhere;
`;

const ExifStatus = styled.p`
	margin: 0.5rem 0 0 1rem;
	font-size: 12px;
	color: #aaa;

	@media (max-width: ${theme.breakpoints.tablet}) {
		margin-left: 0;
	}
`;

const LinkText = styled.a`
	color: #1da1f2;

	&:hover {
		opacity: 0.8;
	}

	&:focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 2px;
	}
`;

const ShareButton = styled.a`
	display: inline-block;
	align-self: start;
	min-width: max-content;
	padding: 0.5rem 1rem;
	font-size: 12px;
	color: #fff;
	text-decoration: none;
	background-color: #1da1f2;
	border-radius: 4px;

	&:hover {
		opacity: 0.8;
	}

	&:focus-visible {
		outline: 2px solid #fff;
		outline-offset: 3px;
	}
`;

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;
const EXACT_URL_PATTERN = /^https?:\/\/[^\s]+$/;

const exifFields: ReadonlyArray<{ column: 1 | 2; key: keyof ExifData; label: string }> = [
	{ column: 1, key: "dateTime", label: "Date" },
	{ column: 1, key: "cameraModel", label: "Camera" },
	{ column: 1, key: "lensModel", label: "Lens" },
	{ column: 2, key: "aperture", label: "Aperture" },
	{ column: 2, key: "shutterSpeed", label: "SS" },
	{ column: 2, key: "iso", label: "ISO" },
	{ column: 2, key: "focalLength", label: "Focal Length" },
];

type ExifState =
	{ status: "error" } | { status: "loading" } | { data: ExifData; status: "success" };

function formatText(text: string) {
	const lines = text.split(/\r?\n/);

	return lines.map((line, lineIndex) => (
		<Fragment key={`${lineIndex}-${line}`}>
			{line.split(URL_PATTERN).map((part, partIndex) =>
				EXACT_URL_PATTERN.test(part) ? (
					<LinkText
						href={part}
						key={`${lineIndex}-${partIndex}`}
						rel="noopener noreferrer"
						target="_blank"
					>
						{part}
					</LinkText>
				) : (
					part
				),
			)}
			{lineIndex < lines.length - 1 && <br />}
		</Fragment>
	));
}

export default function PhotoDetailInfo({ photo }: { photo: PhotoMeta }) {
	const [exifState, setExifState] = useState<ExifState>({ status: "loading" });

	useEffect(() => {
		const controller = new AbortController();

		void getExifDataForPhoto(photo, controller.signal)
			.then((data) => {
				if (!controller.signal.aborted) {
					setExifState({ data, status: "success" });
				}
			})
			.catch(() => {
				if (!controller.signal.aborted) {
					setExifState({ status: "error" });
				}
			});

		return () => controller.abort();
	}, [photo]);

	const emptyValue = exifState.status === "loading" ? "…" : "-";
	const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		`Check out this photo: "${photo.title}"\n`,
	)}&url=${encodeURIComponent(`https://xn--19ja1fb.xn--q9jyb4c/photoworks/${photo.id}/`)}`;

	return (
		<Wrapper aria-label={`${photo.title}の撮影情報`}>
			<CommentText>{formatText(photo.comment)}</CommentText>
			<ExifRegion>
				<ExifList aria-busy={exifState.status === "loading"} aria-label="EXIF情報">
					{exifFields.map((field) => (
						<ExifItem $column={field.column} key={field.key}>
							<ExifTerm>{field.label}</ExifTerm>
							<ExifValue>
								{exifState.status === "success" ? exifState.data[field.key] : emptyValue}
							</ExifValue>
						</ExifItem>
					))}
				</ExifList>
				{exifState.status !== "success" && (
					<ExifStatus role="status">
						{exifState.status === "loading"
							? "撮影情報を読み込んでいます。"
							: "撮影情報を取得できませんでした。"}
					</ExifStatus>
				)}
			</ExifRegion>
			<ShareButton
				aria-label={`「${photo.title}」をXでシェア`}
				href={shareUrl}
				rel="noopener noreferrer"
				target="_blank"
			>
				Share on X
			</ShareButton>
		</Wrapper>
	);
}
