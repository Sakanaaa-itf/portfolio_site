"use client";

import { useState } from "react";
import styled from "styled-components";

const MenuButton = styled.button<{ $isOpen: boolean }>`
	position: fixed;
	top: 20px;
	right: 20px;
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
		transition: transform 0.3s ease-in-out;
	}

	span:nth-child(2) {
		opacity: ${({ $isOpen }) => ($isOpen ? "0" : "1")};
		transform: translateY(0);
		transition: opacity 0.2s ease-in-out;
	}

	span:nth-child(3) {
		transform: ${({ $isOpen }) => ($isOpen ? "translateY(0) rotate(-45deg)" : "translateY(12px)")};
		transition: transform 0.3s ease-in-out;
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
	gap: 20px;
	transition: right 0.3s ease-in-out;
	z-index: 50;
	opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
	transition: right 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;

const MenuItem = styled.a`
	color: white;
	font-size: 20px;
	text-decoration: none;
	transition: color 0.3s ease-in-out;
	text-shadow: 0 0 15px rgba(0, 0, 0, 1);

	&:hover {
		color: #0070f3;
	}
`;

const HamburgerMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<MenuButton $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
				<span></span>
				<span></span>
				<span></span>
			</MenuButton>
			<Menu $isOpen={isOpen}>
				<MenuItem href="#home">🏠 Home</MenuItem>
				<MenuItem href="#about">📖 About Me</MenuItem>
				<MenuItem href="#contact">📩 Contact</MenuItem>
			</Menu>
		</>
	);
};

export default HamburgerMenu;
