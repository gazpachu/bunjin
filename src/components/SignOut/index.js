import React from "react";
import { withFirebase } from "../Firebase";
import { ButtonIcon } from "../../common/common.styles";
import { LogoutIcon } from "../Navigation/styles.js";

const SignOutButton = ({ firebase }) => (
  <ButtonIcon onClick={firebase.doSignOut}>
    <LogoutIcon title="Sign out" />
  </ButtonIcon>
);

export default withFirebase(SignOutButton);
