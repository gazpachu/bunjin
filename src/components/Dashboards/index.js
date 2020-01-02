import React from "react";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import Dashboard from "./Dashboard";

const Dashboards = () => (
  <div>
    <h1>Dashboards</h1>
    <p>The Dashboard is accessible by every signed in user.</p>

    <Dashboard />
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Dashboards);
