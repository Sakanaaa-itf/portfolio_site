"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import HamburgerMenu from "@/components/HamburgerMenu";
import CommentExif from "@/components/CommentExif";
import { useDevice } from "@/hooks/useDevice";
import type { PhotoMeta } from "@/data/photos";

/* ---------- styled ---------- */
const Main = styled.main`
	min-height: 100vh;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Content = styled.div`
    body.menu-open & {
    filter: blur(5px);
    }
`;

const Title = styled.h1`
	font-size: 24px;
	margin: 0.5rem 0;
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

/* ---------- props ---------- */
interface Props {
	photo: PhotoMeta;
	prevPhoto: PhotoMeta | null;
	nextPhoto: PhotoMeta | null;
}

export default function PhotoDetailPage({
	photo,
	prevPhoto,
	nextPhoto,
}: Props) {
	const { isMobile } = useDevice();

	/* SP 用の仮 width/height */
	const fallbackW = 1600;
	const fallbackH = 1067;

	return (
		<Main>
			<HamburgerMenu />
			<Content>
				<Title>{photo.title}</Title>

				{/* ---------- 画像 ---------- */}
				<ImgWrap $isMobile={isMobile}>
					{isMobile ? (
						<Image
							src={photo.highResUrl}
							alt={photo.title}
							width={fallbackW}
							height={fallbackH}
							style={{ maxWidth: "100%", height: "auto" }}
							priority
						/>
					) : (
						<Image
							src={photo.highResUrl}
							alt={photo.title}
							fill
							sizes="100vw"
							style={{ objectFit: "contain" }}
							priority
						/>
					)}

					{/* PC：左右オーバーレイ矢印 */}
					{!isMobile && (
						<NavRow $isMobile={false}>
							{prevPhoto && (
								<NavBtn
									href={`/photoworks/${prevPhoto.id}`}
									scroll={false}
									$isMobile={false}
								>
									‹
								</NavBtn>
							)}
							{nextPhoto && (
								<NavBtn
									href={`/photoworks/${nextPhoto.id}`}
									scroll={false}
									$isMobile={false}
								>
									›
								</NavBtn>
							)}
						</NavRow>
					)}
				</ImgWrap>

				{/* モバイル：画像下ナビ */}
				{isMobile && (
					<NavRow $isMobile={true}>
						{prevPhoto && (
							<NavBtn
								href={`/photoworks/${prevPhoto.id}`}
								scroll={false}
								$isMobile={true}
							>
								‹
							</NavBtn>
						)}
						{nextPhoto && (
							<NavBtn
								href={`/photoworks/${nextPhoto.id}`}
								scroll={false}
								$isMobile={true}
							>
								›
							</NavBtn>
						)}
					</NavRow>
				)}

				{/* ---------- コメント & Exif ---------- */}
				<CommentBox>
					<CommentExif photo={photo} />
				</CommentBox>
			</Content>
		</Main>
	);
}
