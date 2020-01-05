import { createGlobalStyle } from "styled-components";
import "normalize.css";

const GlobalStyles = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    padding: 0;
    position: relative;
    min-height: 100%;
    margin: 0;
    font-family: "Noto Sans JP", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: white;
    background-color: #485461;
    background-image: linear-gradient(315deg, #485461 0%, #28313b 74%);
  }

  a,
  a:active,
  a:hover,
  a:visited {
    color: white;
  }

  button {
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    line-height: 0;
  }
`;

export default GlobalStyles;
