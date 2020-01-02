import React from "react";
import { Link } from "react-router-dom";
import { AuthUserContext } from "../Session";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import {
  AppHeader,
  AppHeaderLink,
  Title,
  Nav,
  NavItem,
  ChatIcon,
  UserIcon,
  AdminIcon,
  LoginIcon
} from "./styles";

const Navigation = ({ authUser }) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <AppHeader>
        <AppHeaderLink to={ROUTES.LANDING}>
          <Title>Shinban</Title>
        </AppHeaderLink>
        <Nav>
          <NavItem>
            {authUser && (
              <Link to={ROUTES.DASHBOARDS} title="Dashboards">
                <ChatIcon />
              </Link>
            )}
          </NavItem>
          {authUser && (
            <NavItem>
              <Link to={ROUTES.ACCOUNT} title="User account">
                <UserIcon />
              </Link>
            </NavItem>
          )}
          {authUser && !!authUser.roles[ROLES.ADMIN] && (
            <NavItem>
              <Link to={ROUTES.ADMIN} title="Admin">
                <AdminIcon />
              </Link>
            </NavItem>
          )}
          <NavItem>
            {authUser ? (
              <SignOutButton />
            ) : (
              <Link to={ROUTES.SIGN_IN} title="Sign in">
                <LoginIcon />
              </Link>
            )}
          </NavItem>
        </Nav>
      </AppHeader>
    )}
  </AuthUserContext.Consumer>
);

export default Navigation;
