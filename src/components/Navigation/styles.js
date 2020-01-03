import styled, { css } from "styled-components";
import { darken } from "polished";
import { Link } from "react-router-dom";
import {
  colors,
  headerHeight,
  breakpoints,
  spacing,
  fontSizes,
  growOnHover
} from "../../common/common.styles";
import { ReactComponent as AdminSvg } from "../../assets/img/cog.svg";
import { ReactComponent as DashboardSvg } from "../../assets/img/dashboard.svg";
import { ReactComponent as LoginSvg } from "../../assets/img/login.svg";
import { ReactComponent as LogoutSvg } from "../../assets/img/logout.svg";
import { ReactComponent as UserSvg } from "../../assets/img/user.svg";

export const AppHeader = styled.header`
  position: relative;
  height: ${headerHeight};
`;

export const HeaderBar = styled.div`
  text-align: center;
  background-color: ${darken(0.04, colors.bg)};
  color: white;
  height: ${headerHeight};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

export const HamburgerBox = styled.div`
  position: relative;
  display: inline-block;
  width: 30px;
  height: 24px;
`;

export const NavButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  line-height: 0px;
  color: white;
  font-weight: lighter;
`;

export const HamburgerButton = styled(NavButton)`
  position: absolute;
  z-index: 2;
  left: ${spacing.l3};
  top: ${spacing.l2};
`;

const HamburgerBar = css`
  display: block;
  content: "";
  position: absolute;
  width: 30px;
  height: 2px;
  border-radius: 4px;
  background-color: #fff;
`;

export const HamburgerInner = styled.div`
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transition-duration: 0.22s;
  position: absolute;
  width: 30px;
  height: 2px;
  transition-timing-function: ease;
  transition-duration: 0.15s;
  transition-property: transform;
  border-radius: 4px;
  background-color: #fff;
  top: 50%;
  display: block;
  margin-top: -2px;

  ${({ isActive }) =>
    isActive &&
    `
      transform: rotate(225deg);
      transition-delay: 0.12s;
      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  `};

  &:before {
    transition: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    top: -10px;
    ${HamburgerBar};

    ${({ isActive }) =>
      isActive &&
      `
      top: 0;
      opacity: 0;
      transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
    `};
  }

  &:after {
    transition: bottom 0.1s 0.25s ease-in,
      transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    bottom: -10px;
    ${HamburgerBar};

    ${({ isActive }) =>
      isActive &&
      `
      bottom: 0;
      transform: rotate(-90deg);
      transition: bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
    `};
  }
`;

export const Nav = styled.ul`
  position: absolute;
  z-index: 1;
  left: 0;
  transition: top 0.2s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  top: -100vh;
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  height: 100vh;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  ${({ isActive }) => isActive && `top: 0;`};
`;

export const NavItem = styled.li`
  padding: ${spacing.l3};
  font-size: ${fontSizes.l1};
  font-weight: lighter;
  ${growOnHover};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.l2};
  }
`;

export const NavLink = styled(Link)`
  text-decoration: none;
`;

export const NavIcon = css`
  fill: white;
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin-right: ${spacing.l3};

  @media (max-width: ${breakpoints.mobile}) {
    width: 35px;
    height: 35px;
  }
`;

export const DashboardIcon = styled(DashboardSvg)`
  ${NavIcon};
`;

export const UserIcon = styled(UserSvg)`
  ${NavIcon};
`;

export const AdminIcon = styled(AdminSvg)`
  ${NavIcon};
`;

export const LoginIcon = styled(LoginSvg)`
  ${NavIcon};
`;

export const LogoutIcon = styled(LogoutSvg)`
  ${NavIcon};
`;
