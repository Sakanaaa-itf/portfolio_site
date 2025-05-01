"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import theme from "../styles/theme";

const MenuButton = styled.button<{ $isOpen: boolean }>`
	position: fixed;
	top: 15px;
	right: 15px;
	width: 40px;
	height: 40px;
	background: none;
	border: none;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 8px;
	z-index: 100;

	span {
		display: block;
		width: 40px;
		height: 4px;
		background: white;
		transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
		position: absolute;
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
	width: 250px;
	height: 100vh;
	padding-top: 90px;
	padding-left: 40px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	gap: 10px;
	transition: right 0.3s ease-in-out;
	z-index: 50;
	opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
	transition: right 0.3s ease-in-out, opacity 0.3s ease-in-out;

	@media (max-width: ${theme.breakpoints.mobile}) {
		width: 160px;
	}
`;

const MenuItem = styled(Link)`
	color: white;
	font-size: 20px;
	text-decoration: none;
	transition: color 0.3s ease-in-out;
	text-shadow: 0 0 15px rgba(0, 0, 0, 1), 4px 4px 30px rgba(0, 0, 0, 1);

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
