"use client";

import styled from "styled-components";
import { JetBrains_Mono } from "next/font/google";
import theme from "../styles/theme";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url("/DSCF0546.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-end;
    width: max-content;
    justify-self: center;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 80px;
  font-weight: 700;
  padding: 1rem;
  font-family: ${jetbrainsMono.style.fontFamily};
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: 48px;
    line-height: 1.2;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 36px;
    line-height: 1.3;
  }
`;

const Home = () => {
  return (
    <Background>
      <TitleWrapper>
        <Title>Portfolio_</Title>
        <Title>Site_</Title>
      </TitleWrapper>
    </Background>
  );
};

export default Home;
