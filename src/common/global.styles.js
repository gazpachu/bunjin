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
  }

  a,
  a:active,
  a:hover,
  a:visited {
    color: white;
  }

  button {
    outline: none;
    cursor: pointer;
  }
`;

export default GlobalStyles;
