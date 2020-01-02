import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { darken } from "polished";
import { colors, headerHeight, spacing } from "../../common/common.styles";
import { ReactComponent as AdminSvg } from "../../assets/img/admin.svg";
import { ReactComponent as ChatSvg } from "../../assets/img/chat.svg";
import { ReactComponent as InfoSvg } from "../../assets/img/info.svg";
import { ReactComponent as LoginSvg } from "../../assets/img/login.svg";
import { ReactComponent as LogoutSvg } from "../../assets/img/logout.svg";
import { ReactComponent as UserSvg } from "../../assets/img/user.svg";

export const AppHeader = styled.header`
  text-align: center;
  background-color: ${darken(0.04, colors.bg)};
  color: white;
  padding: 0 ${spacing.l3};
  height: ${headerHeight};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

export const AppHeaderLink = styled(Link)`
  color: white;
  text-decoration: none;

  &:active,
  &:hover,
  &:visited {
    color: white;
  }
`;

export const Title = styled.h1`
  font-weight: lighter;
  margin: 0;
`;

export const Nav = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li`
  display: inline-flex;
  justify-content: center;
  height: 100%;
  padding-left: ${spacing.l3};
`;

export const NavIcon = css`
  fill: white;
  width: 30px;
  height: 30px;
  vertical-align: middle;
`;

export const ChatIcon = styled(ChatSvg)`
  ${NavIcon};
`;

export const UserIcon = styled(UserSvg)`
  ${NavIcon};
`;

export const AdminIcon = styled(AdminSvg)`
  ${NavIcon};
`;

export const InfoIcon = styled(InfoSvg)`
  ${NavIcon};
`;

export const LoginIcon = styled(LoginSvg)`
  ${NavIcon};
`;

export const LogoutIcon = styled(LogoutSvg)`
  ${NavIcon};
`;
