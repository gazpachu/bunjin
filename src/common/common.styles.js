import styled, { css } from "styled-components";
import { darken } from "polished";
import { Link } from "react-router-dom";

export const headerHeight = "40px";

export const colors = {
  primary: "#7e5bef",
  secondary: "#888",
  bg: "rgba(0,0,0,0.2)",
  bg2: "#3a3a3a",
  red: "#c74343",
  green: "#30b182",
  border: "rgba(255,255,255,0.1)"
};

export const breakpoints = {
  mobile: "768px"
};

export const spacing = {
  l1: "4px",
  l2: "8px",
  l3: "16px",
  l4: "32px",
  l5: "64px"
};

export const fontSizes = {
  l1: "3em",
  l2: "2em",
  l3: "1.5em",
  l4: "1em",
  l5: "0.8em"
};

export const MainContainer = styled.section`
  color: white;
  min-height: 100vh;
  background-color: #485461;
  background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);
  text-align: center;
`;

export const PageContainer = styled.section`
  @media (min-width: ${breakpoints.mobile}) {
    padding: 0 ${spacing.l3};
  }
`;

export const Overlay = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95);
`;

export const button = props => css`
  background-color: ${props.color ? colors[props.color] : colors.green};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  color: white;
  line-height: inherit;
  font-size: ${props.size === "small" ? "11px" : "14px"};
  padding: ${props.size === "small" ? "5px" : "10px 20px"};
  white-space: nowrap;
  transition: all 0.2s ease-in;
  width: ${props.shouldFitContainer ? "100%" : "auto"};

  &:hover {
    background: ${props.color
      ? darken(0.05, colors[props.color])
      : darken(0.05, colors.green)};
  }

  opacity: ${props.disabled && ".5"};
  pointer-events: ${props.disabled && "none"};
`;

export const Button = styled.button`
  ${button};
`;

export const ButtonLink = styled(Link)`
  ${button};
  text-decoration: none;
`;

export const ButtonIcon = styled.button`
  background: none;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

export const formElement = css`
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.4);
  color: white;
  border-radius: 5px;
  padding: 6px 8px;
  line-height: 22px;
  outline: none;
  width: 100%;
`;

export const Form = styled.form``;

export const FormInput = styled.input`
  ${formElement};
  margin-bottom: ${spacing.l3};
`;

export const FormButton = styled.button`
  ${button};
  margin-bottom: ${spacing.l3};
  width: 100%;
`;

export const Select = styled.select`
  font-size: ${({ size }) => (size === "small" ? "11px" : "14px")};
  padding: ${({ size }) => (size === "small" ? "5px" : "10px 20px")};
  appearance: none;
  background: none;
  color: white;
  border: none;
  outline: none;
  position: relative;
  display: inline-block;
  padding-right: 20px;
  line-height: 1.5em;
  border-radius: 4px;
  background-image: linear-gradient(45deg, transparent 50%, white 50%),
    linear-gradient(135deg, white 50%, transparent 50%);
  background-position: ${({ size }) =>
    size === "small"
      ? "calc(100% - 5px) calc(13px), calc(100%) calc(13px)"
      : "calc(100% - 5px) calc(18px), calc(100%) calc(18px)"};
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
`;

export const growOnHover = css`
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;
