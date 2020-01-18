import React from "react";
import { Switch, Route } from "react-router-dom";
import { compose } from "recompose";
import PublicLayout from "../PublicLayout/";
import { withAuthorization, withEmailVerification } from "../Session";
import { UserList, UserItem } from "../Users";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

const AdminPage = () => (
  <PublicLayout>
    <h1>Admin</h1>
    <p>The Admin Page is accessible by every signed in admin user.</p>

    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </PublicLayout>
);

const condition = authUser => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(AdminPage);
