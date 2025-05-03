"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styled from "styled-components";

import theme from "@/styles/theme";

const MenuButton = styled.button<{ $isOpen: boolean }>`
	position: fixed;
	top: 15px;
	right: 15px;
	z-index: 100;
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	cursor: pointer;
	background: none;
	border: none;

	span {
		position: absolute;
		display: block;
		width: 40px;
		height: 4px;
		background: white;
		transition:
			transform 0.3s ease-in-out,
			opacity 0.3s ease-in-out;
	}

	span:nth-child(1) {
		transform: ${({ $isOpen }) => ($isOpen ? "translateY(0) rotate(45deg)" : "translateY(-12px)")};
	}

	span:nth-child(2) {
		opacity: ${({ $isOpen }) => ($isOpen ? "0" : "1")};
		transform: translateY(0);
	}

	span:nth-child(3) {
		transform: ${({ $isOpen }) => ($isOpen ? "translateY(0) rotate(-45deg)" : "translateY(12px)")};
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		width: 30px;
		height: 30px;

		span {
			width: 30px;
			height: 3px;
		}
	}
`;

const Menu = styled.nav<{ $isOpen: boolean }>`
	position: fixed;
	top: 0;
	right: ${({ $isOpen }) => ($isOpen ? "0" : "-100%")};
	z-index: 50;
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: flex-start;
	justify-content: flex-start;
	width: 250px;
	height: 100vh;
	padding-top: 90px;
	padding-left: 40px;
	opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
	transition:
		right 0.3s ease-in-out,
		opacity 0.3s ease-in-out;

	@media (max-width: ${theme.breakpoints.mobile}) {
		width: 160px;
	}
`;

const MenuItem = styled(Link)`
	font-size: 20px;
	color: white;
	text-decoration: none;
	text-shadow:
		0 0 15px rgba(0, 0, 0, 1),
		4px 4px 30px rgba(0, 0, 0, 1);
	transition: color 0.3s ease-in-out;

	&:hover {
		color: #0070f3;
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		font-size: 14px;
	}
`;

const HamburgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (isOpen) {
			document.body.classList.add("menu-open");
		} else {
			document.body.classList.remove("menu-open");
		}
	}, [isOpen]);

	return (
		<>
			<MenuButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
				<span></span>
				<span></span>
				<span></span>
			</MenuButton>
			<Menu $isOpen={isOpen}>
				<MenuItem href="/#home">🏠 Home</MenuItem>
				<MenuItem href="/#about">📖 About Me</MenuItem>
				<MenuItem href="/photoworks">📸 Photoworks</MenuItem>
				<MenuItem href="/ramen">🍜 Ramen</MenuItem>
				<MenuItem href="/albumartwork">🎵 Music</MenuItem>
				<MenuItem href="/links">📩 Links</MenuItem>
			</Menu>
		</>
	);
};

export default HamburgerMenu;
