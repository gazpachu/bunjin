import React from "react";
import LandingImg from "../../assets/img/landing.png";
import { LandingWrapper, Hero, LandingImage } from "./styles";

const Landing = ({ children }) => (
  <LandingWrapper>
    <Hero>
      <h1>Bunjin.net</h1>
      <h4>A simple & customizable RSS News Reader</h4>
      {children}
    </Hero>
    <LandingImage src={LandingImg} />
  </LandingWrapper>
);

export default Landing;
