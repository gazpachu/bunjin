import styled, { css } from "styled-components";
import { darken } from "polished";
import { Link } from "react-router-dom";

export const headerHeight = "50px";

export const colors = {
  primary: "#7e5bef",
  secondary: "#888",
  bg: "#5b8fef",
  red: "#c74343",
  green: "#30b182"
};

export const breakpoints = {
  mobile: "768px"
};

export const spacing = {
  l1: "4px",
  l2: "8px",
  l3: "16px",
  l4: "32px"
};

export const PageContainer = styled.section`
  text-align: center;
  padding: 20px;
  background: linear-gradient(
    to bottom,
    ${colors.bg} 0%,
    rgba(112, 64, 117, 0.85) 100%
  );
  color: white;
  min-height: calc(100vh - ${headerHeight});
`;

export const button = props => css`
  outline: none;
  background-color: ${props.color ? colors[props.color] : colors.green};
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  color: white;
  font-size: ${props.size === "small" ? "11px" : "14px"};
  padding: ${props.size === "small" ? "5px" : "10px 20px"};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-in;

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
  background-color: white;
  border: 1px solid ${colors.secondary};
  color: #333;
  border-radius: 5px;
  padding: 8px;
  line-height: 25px;
  outline: none;
  width: 100%;
`;

export const Form = styled.form`
  max-width: 300px;
  margin: 0 auto;
`;

export const FormInput = styled.input`
  ${formElement};
  margin-bottom: ${spacing.l3};
`;

export const FormButton = styled.button`
  ${button};
  margin-bottom: ${spacing.l3};
  width: 100%;
`;
