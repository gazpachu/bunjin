import React, { Fragment, useState } from "react";
import { SignUpForm } from "../SignUp/";
import SignInPage from "../SignIn/";
import LandingImg from "../../assets/img/landing.png";
import { LandingWrapper, Hero, LandingImage } from "./styles";

const Landing = () => {
  const [isSigninActive, setSigninActive] = useState(false);

  return (
    <LandingWrapper>
      <Hero>
        <h1>Bunjin.net</h1>
        <h4>A simple & customizable RSS News Reader</h4>
        {!isSigninActive && (
          <Fragment>
            <SignUpForm />
            Already have an account?{" "}
            <button onClick={setSigninActive}>Sign In</button>
          </Fragment>
        )}
        {isSigninActive && <SignInPage />}
      </Hero>
      <LandingImage src={LandingImg} />
    </LandingWrapper>
  );
};

export default Landing;
