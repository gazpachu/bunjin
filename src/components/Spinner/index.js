import React from "react";
import styled, { keyframes } from "styled-components";

const SpinnerAnim = keyframes`
  100% { transform: rotate(360deg); }
`;

const DotAnim = keyframes`
  80%, 100% { transform: rotate(360deg); }
`;

const DotBeforeAnim = keyframes`
  50% {
    transform: scale(0.4); 
  } 100%, 0% {
    transform: scale(1.0); 
  } 
`;

const SpinnerWrapper = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  animation: ${SpinnerAnim} 2.5s infinite linear both;
  ${({ centered }) => centered && `margin: 20px auto`};
  mix-blend-mode: difference;
`;

const Dot = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  animation: ${DotAnim} 2s infinite ease-in-out both;

  &:before {
    content: "";
    display: block;
    width: 25%;
    height: 25%;
    background-color: #fff;
    border-radius: 100%;
    animation: ${DotBeforeAnim} 2s infinite ease-in-out both;
  }

  &:nth-child(1) {
    animation-delay: -1.1s;
  }
  &:nth-child(2) {
    animation-delay: -1s;
  }
  &:nth-child(3) {
    animation-delay: -0.9s;
  }
  &:nth-child(4) {
    animation-delay: -0.8s;
  }
  &:nth-child(5) {
    animation-delay: -0.7s;
  }
  &:nth-child(6) {
    animation-delay: -0.6s;
  }
  &:nth-child(1):before {
    animation-delay: -1.1s;
  }
  &:nth-child(2):before {
    animation-delay: -1s;
  }
  &:nth-child(3):before {
    animation-delay: -0.9s;
  }
  &:nth-child(4):before {
    animation-delay: -0.8s;
  }
  &:nth-child(5):before {
    animation-delay: -0.7s;
  }
  &:nth-child(6):before {
    animation-delay: -0.6s;
  }
`;

function Spinner({ centered }) {
  return (
    <SpinnerWrapper centered={centered}>
      <Dot />
      <Dot />
      <Dot />
      <Dot />
      <Dot />
      <Dot />
    </SpinnerWrapper>
  );
}

export default Spinner;
