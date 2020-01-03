import React, { useState, Fragment } from "react";
import { withFirebase } from "../Firebase";
import { AuthUserContext } from "../Session";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";
import {
  AppHeader,
  HeaderBar,
  HamburgerBox,
  HamburgerButton,
  HamburgerInner,
  Nav,
  NavItem,
  NavLink,
  NavButton,
  DashboardIcon,
  UserIcon,
  AdminIcon,
  LoginIcon,
  LogoutIcon
} from "./styles";

const Navigation = ({ authUser, firebase }) => {
  const [isMenuActive, setMenuActive] = useState(0);

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <AppHeader>
          <HeaderBar />
          <Nav isActive={isMenuActive}>
            <NavItem>
              {authUser && (
                <NavLink
                  to={ROUTES.DASHBOARDS}
                  title="Dashboards"
                  onClick={() => setMenuActive(false)}
                >
                  <DashboardIcon />
                  <span>Dashboards</span>
                </NavLink>
              )}
            </NavItem>
            {authUser && (
              <NavItem>
                <NavLink
                  to={ROUTES.ACCOUNT}
                  title="User account"
                  onClick={() => setMenuActive(false)}
                >
                  <UserIcon />
                  <span>Account</span>
                </NavLink>
              </NavItem>
            )}
            {authUser && !!authUser.roles[ROLES.ADMIN] && (
              <NavItem>
                <NavLink
                  to={ROUTES.ADMIN}
                  title="Admin"
                  onClick={() => setMenuActive(false)}
                >
                  <AdminIcon />
                  <span>Admin</span>
                </NavLink>
              </NavItem>
            )}

            {authUser ? (
              <NavItem>
                <NavButton
                  onClick={() => {
                    setMenuActive(false);
                    firebase.doSignOut();
                  }}
                >
                  <LogoutIcon title="Sign out" />
                  <span>Sign out</span>
                </NavButton>
              </NavItem>
            ) : (
              <Fragment>
                <NavItem>
                  <NavLink
                    to={ROUTES.SIGN_IN}
                    title="Sign in"
                    onClick={() => setMenuActive(false)}
                  >
                    <LoginIcon />
                    <span>Sign in</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    to={ROUTES.SIGN_UP}
                    title="Sign up"
                    onClick={() => setMenuActive(false)}
                  >
                    <LoginIcon />
                    <span>Sign up</span>
                  </NavLink>
                </NavItem>
              </Fragment>
            )}
          </Nav>
          <HamburgerButton onClick={() => setMenuActive(!isMenuActive)}>
            <HamburgerBox>
              <HamburgerInner isActive={isMenuActive} />
            </HamburgerBox>
          </HamburgerButton>
        </AppHeader>
      )}
    </AuthUserContext.Consumer>
  );
};

export default withFirebase(Navigation);
