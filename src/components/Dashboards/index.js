import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import PublicLayout from "../PublicLayout/";
import { Form, FormInput, Button } from "../../common/common.styles";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";
import { DashboardList, DashboardButton } from "./styles";
import Spinner from "../Spinner/";

const DashboardsPage = () => (
  <AuthUserContext.Consumer>
    {authUser => <Dashboards authUser={authUser} />}
  </AuthUserContext.Consumer>
);

const DashboardItem = ({ dashboard }) => (
  <DashboardButton>
    <Link to={`${ROUTES.DASHBOARDS}/${dashboard.uid}`}>
      <h1>{dashboard.name}</h1>
    </Link>
  </DashboardButton>
);

class DashboardsBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      dashboards: [],
      limit: 5,
      name: ""
    };
  }

  componentDidMount() {
    this.onListenForDashboards();
  }

  onListenForDashboards = () => {
    const { authUser, history } = this.props;
    if (authUser) {
      this.setState({ loading: true });

      this.unsubscribe = this.props.firebase
        .userDashboards(authUser.uid)
        .orderBy("createdAt", "desc")
        .limit(this.state.limit)
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            let dashboards = [];
            snapshot.forEach(doc =>
              dashboards.push({ ...doc.data(), uid: doc.id })
            );

            this.setState({
              dashboards: dashboards.reverse(),
              loading: false
            });
          } else {
            this.props.firebase
              .dashboards()
              .add({
                name: "My Dashboard",
                userId: authUser.uid,
                createdAt: this.props.firebase.fieldValue.serverTimestamp()
              })
              .then(newDashboard =>
                history.push(`${ROUTES.DASHBOARDS}/${newDashboard.id}`)
              );
            this.setState({ dashboards: null, loading: false });
          }
        });
    }
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForDashboards
    );
  };

  onChangeName = event => {
    this.setState({ name: event.target.value });
  };

  onCreateDashboard = (event, authUser) => {
    this.props.firebase.dashboards().add({
      name: this.state.name,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ name: "" });

    event.preventDefault();
  };

  render() {
    const { dashboards, loading, limit, name } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <PublicLayout>
            {!loading && dashboards && dashboards.length > limit && (
              <Button type="button" onClick={this.onNextPage}>
                Load More
              </Button>
            )}

            {loading && <Spinner centered />}

            {dashboards && (
              <DashboardList>
                {dashboards.map(dashboard => (
                  <DashboardItem
                    authUser={authUser}
                    key={dashboard.uid}
                    dashboard={dashboard}
                  />
                ))}
              </DashboardList>
            )}

            {!dashboards && <div>There are no dashboards ...</div>}
            <Form onSubmit={event => this.onCreateDashboard(event, authUser)}>
              <FormInput
                type="text"
                autoFocus
                value={name}
                onChange={this.onChangeName}
                placeholder="Dashboard name"
              />
              <Button type="submit">Create new dashboard</Button>
            </Form>
          </PublicLayout>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const Dashboards = compose(withRouter, withFirebase)(DashboardsBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(DashboardsPage);
