import React, { Component, Fragment } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import Feeds from "../Feeds";
import Tabs from "../Tabs";
import { DashboardSelect } from "./styles";

const DashboardPage = ({ match }) => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Dashboard
        authUser={authUser}
        dashboardId={match.params.dashboardId}
        tabId={match.params.tabId}
      />
    )}
  </AuthUserContext.Consumer>
);

class DashboardBase extends Component {
  constructor(props) {
    super(props);

    const { dashboardId } = this.props;

    this.state = {
      loading: false,
      dashboards: null,
      tabs: [],
      selectedDashboard: dashboardId,
      selectedTab: null
    };
  }

  componentDidMount() {
    const { dashboardId, authUser } = this.props;

    if (authUser && dashboardId) {
      this.props.firebase
        .dashboards(authUser.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot(dashboardsSnapshot => {
          if (dashboardsSnapshot.size) {
            let dashboards = [];
            dashboardsSnapshot.forEach(doc =>
              dashboards.push({ ...doc.data(), uid: doc.id })
            );

            this.setState({
              dashboards: dashboards.reverse(),
              loading: false
            });

            this.loadTabs();
          } else {
            this.setState({ dashboards: null, loading: false });
          }
        });
    }
  }

  handleChange = event => {
    this.setState({ selectedDashboard: event.target.value });
    this.props.history.push(`${ROUTES.DASHBOARDS}/${event.target.value}`);
    this.loadTabs(event.target.value);
  };

  loadTabs(id) {
    const { dashboardId, tabId, authUser } = this.props;
    const dId = id || dashboardId;

    this.props.firebase.dashboardTabs(dId).onSnapshot(tabsSnapshot => {
      if (tabsSnapshot.size) {
        let tabs = [];
        tabsSnapshot.forEach(doc => tabs.push({ ...doc.data(), uid: doc.id }));
        const foundTab = tabs.find(tab => tab.uid === tabId);
        this.setState({
          tabs: tabs.reverse(),
          loading: false,
          selectedTab: foundTab ? foundTab : tabs[0]
        });
      } else {
        this.props.firebase.tabs().add({
          name: "My Tab",
          dashboardId: dId,
          userId: authUser.uid,
          createdAt: this.props.firebase.fieldValue.serverTimestamp()
        });
        this.setState({ tabs: null, loading: false });
      }
    });
  }

  render() {
    const {
      loading,
      dashboards,
      tabs,
      selectedDashboard,
      selectedTab
    } = this.state;
    const { authUser, dashboardId, history } = this.props;

    return (
      <Fragment>
        {loading && <div>Loading ...</div>}
        {dashboards && (
          <Fragment>
            <Tabs
              tabs={tabs}
              dashboardId={dashboardId}
              authUser={authUser}
              selectedTab={selectedTab}
              setActiveTab={selectedTab => {
                this.setState({ selectedTab });
                history.push(
                  `${ROUTES.DASHBOARDS}/${dashboardId}/${selectedTab.uid}`
                );
              }}
            />
            <DashboardSelect
              value={selectedDashboard}
              onChange={this.handleChange}
            >
              {dashboards.map(dashboard => (
                <option key={dashboard.uid} value={dashboard.uid}>
                  {dashboard.name}
                </option>
              ))}
            </DashboardSelect>
            <Feeds selectedTab={selectedTab} />
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const Dashboard = compose(withRouter, withFirebase)(DashboardBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(DashboardPage);
