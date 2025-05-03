"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

import HamburgerMenu from "@/components/HamburgerMenu";
import CommentExif from "@/components/PhotoDetailInfo";
import { useDevice } from "@/hooks/useDevice";

import type { PhotoMeta } from "@/data/photos";

const Main = styled.main`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	padding: 1rem;
`;

const Content = styled.div`
	body.menu-open & {
		filter: blur(5px);
	}
`;

const Title = styled.h1`
	margin: 0.5rem 0;
	font-size: 24px;
`;

const ImgWrap = styled.div<{ $isMobile: boolean }>`
	position: relative;
	width: 100%;
	max-width: 1200px;
	${({ $isMobile }) => ($isMobile ? "" : "height: calc(100vh - 200px);")}
	display: flex;
	justify-content: center;
	align-items: center;
`;

const NavRow = styled.div<{ $isMobile: boolean }>`
	${({ $isMobile }) =>
		$isMobile
			? `
            margin-top: .5rem;
            width: 100%;
            max-width: 1200px;
            display: flex;
            justify-content: space-between;
        `
			: `
            position: absolute;
            top: 50%;
            left: -4rem;
            right: -4rem;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-between;
            pointer-events: none;
        `}
`;

const NavBtn = styled(Link)<{ $isMobile: boolean }>`
	font-size: ${({ $isMobile }) => ($isMobile ? "20px" : "40px")};
	line-height: 1;
	color: rgba(255, 255, 255, 0.9);
	text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
	pointer-events: auto;
	${({ $isMobile }) => ($isMobile ? "" : "padding: 0 .4rem;")}
`;

const CommentBox = styled.div`
	width: 100%;
	max-width: 1200px;
	margin-top: 1rem;
`;

interface Props {
	nextPhoto: PhotoMeta | null;
	photo: PhotoMeta;
	prevPhoto: PhotoMeta | null;
}

export default function PhotoDetailPage({ photo, prevPhoto, nextPhoto }: Props) {
	const { isMobile } = useDevice();

	const fallbackW = 1600;
	const fallbackH = 1067;

	return (
		<Main>
			<HamburgerMenu />
			<Content>
				<Title>{photo.title}</Title>
				<ImgWrap $isMobile={isMobile}>
					{isMobile ? (
						<Image
							alt={photo.title}
							height={fallbackH}
							priority
							src={photo.highResUrl}
							style={{ height: "auto", maxWidth: "100%" }}
							width={fallbackW}
						/>
					) : (
						<Image
							alt={photo.title}
							fill
							priority
							sizes="100vw"
							src={photo.highResUrl}
							style={{ objectFit: "contain" }}
						/>
					)}
					{!isMobile && (
						<NavRow $isMobile={false}>
							{prevPhoto && (
								<NavBtn $isMobile={false} href={`/photoworks/${prevPhoto.id}`} scroll={false}>
									‹
								</NavBtn>
							)}
							{nextPhoto && (
								<NavBtn $isMobile={false} href={`/photoworks/${nextPhoto.id}`} scroll={false}>
									›
								</NavBtn>
							)}
						</NavRow>
					)}
				</ImgWrap>
				{isMobile && (
					<NavRow $isMobile={true}>
						{prevPhoto && (
							<NavBtn $isMobile={true} href={`/photoworks/${prevPhoto.id}`} scroll={false}>
								‹
							</NavBtn>
						)}
						{nextPhoto && (
							<NavBtn $isMobile={true} href={`/photoworks/${nextPhoto.id}`} scroll={false}>
								›
							</NavBtn>
						)}
					</NavRow>
				)}
				<CommentBox>
					<CommentExif photo={photo} />
				</CommentBox>
			</Content>
		</Main>
	);
}
