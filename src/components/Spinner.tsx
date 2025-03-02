"use client";

import styled, { keyframes } from "styled-components";

const spin = keyframes`
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
	width: 50px;
	height: 50px;
	border: 5px solid #ccc;
	border-top-color: #0070f3;
	border-radius: 50%;
	animation: ${spin} 1s linear infinite;
`;

const Spinner = () => {
	return <SpinnerWrapper />;
};

export default Spinner;
