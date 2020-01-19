import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import PublicLayout from "../PublicLayout/";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import Spinner from "../Spinner/";
import { EmailIcon, GoogleIcon, FacebookIcon, TwitterIcon } from "./styles";
import { Form, FormInput, FormButton } from "../../common/common.styles.js";

const SignInLink = () => (
  <p>
    Already have an account? <Link to={ROUTES.SIGN_IN}>Sign In</Link>
  </p>
);

const SignInPage = () => (
  <PublicLayout>
    <SignInForm />
    <SignInGoogle />
    <SignInFacebook />
    <SignInTwitter />
    <PasswordForgetLink />
    <SignUpLink />
  </PublicLayout>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
  loading: false
};

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.setState({ loading: true });
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(`${ROUTES.DASHBOARDS}`);
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error, loading } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <Form onSubmit={this.onSubmit}>
        <FormInput
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <FormInput
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        {!loading ? (
          <FormButton disabled={isInvalid} type="submit">
            <EmailIcon />
            Sign In with Email
          </FormButton>
        ) : (
          <Spinner centered />
        )}

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null, loading: false };
  }

  onSubmit = event => {
    this.setState({ loading: true });
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {}
          },
          { merge: true }
        );
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(`${ROUTES.DASHBOARDS}`);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error, loading: false });
      });

    event.preventDefault();
  };

  render() {
    const { error, loading } = this.state;

    return (
      <Form onSubmit={this.onSubmit}>
        {!loading ? (
          <FormButton type="submit">
            <GoogleIcon />
            Sign In with Google
          </FormButton>
        ) : (
          <Spinner centered />
        )}

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null, loading: false };
  }

  onSubmit = event => {
    this.setState({ loading: true });
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {}
          },
          { merge: true }
        );
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(`${ROUTES.DASHBOARDS}`);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error, loading: false });
      });

    event.preventDefault();
  };

  render() {
    const { error, loading } = this.state;

    return (
      <Form onSubmit={this.onSubmit}>
        {!loading ? (
          <FormButton type="submit">
            <FacebookIcon />
            Sign In with Facebook
          </FormButton>
        ) : (
          <Spinner centered />
        )}

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null, loading: false };
  }

  onSubmit = event => {
    this.setState({ loading: true });
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {}
          },
          { merge: true }
        );
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(`${ROUTES.DASHBOARDS}`);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error, loading: false });
      });

    event.preventDefault();
  };

  render() {
    const { error, loading } = this.state;

    return (
      <Form onSubmit={this.onSubmit}>
        {!loading ? (
          <FormButton type="submit">
            <TwitterIcon />
            Sign In with Twitter
          </FormButton>
        ) : (
          <Spinner centered />
        )}

        {error && <p>{error.message}</p>}
      </Form>
    );
  }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

const SignInGoogle = compose(withRouter, withFirebase)(SignInGoogleBase);

const SignInFacebook = compose(withRouter, withFirebase)(SignInFacebookBase);

const SignInTwitter = compose(withRouter, withFirebase)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter, SignInLink };
