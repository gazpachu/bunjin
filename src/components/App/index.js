import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import GlobalStyles from "../../common/global.styles";
import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import DashboardsPage from "../Dashboards";
import DashboardPage from "../Dashboards/Dashboard";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { PageContainer } from "../../common/common.styles";

const App = () => (
  <Router>
    <div>
      <GlobalStyles />
      <Navigation />
      <PageContainer>
        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route
          path={`${ROUTES.DASHBOARDS}/:dashboardId`}
          component={DashboardPage}
        />
        <Route exact path={ROUTES.DASHBOARDS} component={DashboardsPage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
      </PageContainer>
    </div>
  </Router>
);

export default withAuthentication(App);
