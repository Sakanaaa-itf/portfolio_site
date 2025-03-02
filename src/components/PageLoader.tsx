"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(255, 255, 255, 0.9);
	z-index: 9999;
	transition: opacity 0.3s ease-in-out;
`;

const Spinner = styled.div`
	width: 50px;
	height: 50px;
	border: 5px solid #ccc;
	border-top-color: #0070f3;
	border-radius: 50%;
	animation: ${spin} 1s linear infinite;
`;

const PageLoader = () => {
	const pathname = usePathname();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const timer = setTimeout(() => {
			setLoading(false);
		}, 1000); // 1秒後に非表示
		return () => clearTimeout(timer);
	}, [pathname]);

	if (!loading) return null;

	return (
		<LoaderWrapper>
			<Spinner />
		</LoaderWrapper>
	);
};

export default PageLoader;
