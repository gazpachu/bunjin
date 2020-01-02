import React from "react";
import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";
import Feeds from "../Feeds";

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>

    <Feeds />
  </div>
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Dashboard);
