"use client";

import styled, { keyframes } from "styled-components";

const spin = keyframes`
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
`;

const LoaderWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f8f8f8;
`;

const Spinner = styled.div`
	width: 50px;
	height: 50px;
	border: 5px solid #ccc;
	border-top-color: #0070f3;
	border-radius: 50%;
	animation: ${spin} 1s linear infinite;
`;

const Loading = () => {
	return (
		<LoaderWrapper>
			<Spinner />
		</LoaderWrapper>
	);
};

export default Loading;
