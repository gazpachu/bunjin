import React, { Component } from "react";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase.users().onSnapshot(snapshot => {
      let users = [];

      snapshot.forEach(doc => users.push({ ...doc.data(), uid: doc.id }));

      this.setState({
        users,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h2>Users</h2>
        {loading && <Spinner centered />}
        <ul>
          {users.map(user => (
            <li key={user.uid}>
              <p>
                <strong>ID:</strong> {user.uid}
                <br />
                <strong>E-Mail:</strong> {user.email}
                <br />
                <strong>Username:</strong> {user.username}
                <br />
                <Link
                  to={{
                    pathname: `${ROUTES.ADMIN}/${user.uid}`,
                    state: { user }
                  }}
                >
                  Details
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(UserList);
