import styled from "styled-components";

export const LandingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #f9daeb;
  color: #2c292d;

  a {
    color: #2c292d;
  }
`;

export const Hero = styled.div`
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
`;

export const LandingImage = styled.img`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;
