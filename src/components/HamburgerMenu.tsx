"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";

import theme from "@/styles/theme";

const MENU_ITEMS = [
	{ href: "/#home", label: "🏠 Home" },
	{ href: "/#about", label: "📖 About Me" },
	{ href: "/photoworks", label: "📸 Photoworks" },
	{ href: "/ramen", label: "🍜 Ramen" },
	{ href: "/albumartwork", label: "🎵 Music" },
	{ href: "/links", label: "📩 Links" },
] as const;

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
	padding: 0;
	touch-action: manipulation;
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
		opacity: ${({ $isOpen }) => ($isOpen ? 0 : 1)};
		transform: translateY(0);
	}

	span:nth-child(3) {
		transform: ${({ $isOpen }) => ($isOpen ? "translateY(0) rotate(-45deg)" : "translateY(12px)")};
	}

	&:focus-visible {
		outline: 3px solid #fff;
		outline-offset: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		span {
			transition: none;
		}
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
	right: ${({ $isOpen }) => ($isOpen ? 0 : "-100%")};
	z-index: 50;
	display: flex;
	visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
	flex-direction: column;
	gap: 10px;
	align-items: flex-start;
	justify-content: flex-start;
	width: 250px;
	height: 100vh;
	height: 100dvh;
	padding-top: 90px;
	padding-left: 40px;
	pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
	opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
	transition:
		right 0.3s ease-in-out,
		opacity 0.3s ease-in-out,
		visibility 0s linear ${({ $isOpen }) => ($isOpen ? "0s" : "0.3s")};

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		width: 160px;
	}
`;

const MenuItem = styled(Link)`
	font-size: 20px;
	color: white;
	text-decoration: none;
	text-shadow:
		0 0 15px rgb(0 0 0),
		4px 4px 30px rgb(0 0 0);
	transition: color 0.3s ease-in-out;

	&:hover {
		color: #0070f3;
	}

	&:focus-visible {
		outline: 2px solid currentcolor;
		outline-offset: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}

	@media (max-width: ${theme.breakpoints.mobile}) {
		font-size: 14px;
	}
`;

export default function HamburgerMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const menuId = useId();
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const { body } = document;

		if (!isOpen) {
			body.classList.remove("menu-open");
			return;
		}

		const previousOverflow = body.style.overflow;
		body.classList.add("menu-open");
		body.style.overflow = "hidden";

		const focusFrame = window.requestAnimationFrame(() => {
			menuRef.current?.querySelector<HTMLElement>("[data-menu-item]")?.focus();
		});

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				setIsOpen(false);
				menuButtonRef.current?.focus();
				return;
			}

			if (event.key !== "Tab") return;

			const menuItems = Array.from(
				menuRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? [],
			);
			const focusableElements = [menuButtonRef.current, ...menuItems].filter(
				(element): element is HTMLElement => element !== null,
			);
			const firstElement = focusableElements[0];
			const lastElement = focusableElements.at(-1);

			if (event.shiftKey && document.activeElement === firstElement) {
				event.preventDefault();
				lastElement?.focus();
			} else if (!event.shiftKey && document.activeElement === lastElement) {
				event.preventDefault();
				firstElement?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			window.cancelAnimationFrame(focusFrame);
			document.removeEventListener("keydown", handleKeyDown);
			body.classList.remove("menu-open");
			body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

	return (
		<>
			<MenuButton
				$isOpen={isOpen}
				aria-controls={menuId}
				aria-expanded={isOpen}
				aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
				onClick={() => setIsOpen((current) => !current)}
				ref={menuButtonRef}
				type="button"
			>
				<span aria-hidden="true" />
				<span aria-hidden="true" />
				<span aria-hidden="true" />
			</MenuButton>
			<Menu
				$isOpen={isOpen}
				aria-hidden={!isOpen}
				aria-label="サイト内ナビゲーション"
				id={menuId}
				ref={menuRef}
			>
				{MENU_ITEMS.map(({ href, label }) => (
					<MenuItem
						data-menu-item=""
						href={href}
						key={href}
						onClick={() => setIsOpen(false)}
						tabIndex={isOpen ? 0 : -1}
					>
						{label}
					</MenuItem>
				))}
			</Menu>
		</>
	);
}
