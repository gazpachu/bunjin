import React from "react";
import PublicLayout from "../PublicLayout/";
import { Button } from "../../common/common.styles";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes("password");

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <PublicLayout>
                {this.state.isSent ? (
                  <p>
                    Check you E-Mails (Spam folder included) for a confirmation
                    E-Mail. Refresh this page once you confirmed your E-Mail.
                  </p>
                ) : (
                  <p>
                    Check you E-Mails (Spam folder included) for a confirmation
                    E-Mail or send another confirmation E-Mail.
                  </p>
                )}

                <Button
                  type="button"
                  onClick={this.onSendEmailVerification}
                  disabled={this.state.isSent}
                >
                  Send confirmation E-Mail
                </Button>
              </PublicLayout>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
