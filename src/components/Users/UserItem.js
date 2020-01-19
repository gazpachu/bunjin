import React, { Component } from "react";
import Spinner from "../Spinner/";
import { withFirebase } from "../Firebase";
import { Button } from "../../common/common.styles";

class UserItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      sent: false,
      ...props.location.state
    };
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .user(this.props.match.params.id)
      .onSnapshot(snapshot => {
        this.setState({
          user: snapshot.data(),
          loading: false
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  onSendPasswordResetEmail = () => {
    this.setState({ sent: true }, () =>
      this.props.firebase.doPasswordReset(this.state.user.email)
    );
  };

  render() {
    const { user, loading, sent } = this.state;

    return (
      <div>
        <h4>User ({this.props.match.params.id})</h4>
        {loading && <Spinner centered />}

        {user && (
          <div>
            <p>
              <strong>ID:</strong> {user.uid}
              <br />
              <strong>E-Mail:</strong> {user.email}
              <br />
              <strong>Username:</strong> {user.username}
            </p>
            {!sent && (
              <Button type="button" onClick={this.onSendPasswordResetEmail}>
                Send Password Reset
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default withFirebase(UserItem);
