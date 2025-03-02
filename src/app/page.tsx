"use client";

import styled from "styled-components";

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url("https://pub-824fe0d919c34f7cb64cd8ff97e0833e.r2.dev/DSCF0546.JPG");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  padding: 1rem;
  border-radius: 10px;
`;

const Home = () => {
  return (
    <Background>
      <Title>Portfolio_site_</Title>
    </Background>
  );
};

export default Home;
