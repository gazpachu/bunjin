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
    {authUser => <Dashboard authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class DashboardBase extends Component {
  constructor(props) {
    super(props);

    const { match } = this.props;

    this.state = {
      loading: false,
      dashboards: null,
      tabs: [],
      selectedDashboard: match.params.dashboardId,
      selectedTab: null
    };
  }

  componentDidMount() {
    const { match, authUser, firebase } = this.props;

    if (authUser && match.params.dashboardId) {
      this.unsubscribeDashboards = firebase
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

  componentWillUnmount() {
    this.unsubscribeDashboards && this.unsubscribeDashboards();
    this.unsubscribeTabs && this.unsubscribeTabs();
  }

  handleChange = event => {
    this.setState({ selectedDashboard: event.target.value });
    this.props.history.push(`${ROUTES.DASHBOARDS}/${event.target.value}`);
    this.loadTabs(event.target.value);
  };

  loadTabs(id) {
    const { match, authUser, firebase } = this.props;
    const dId = id || match.params.dashboardId;

    this.unsubscribeTabs = firebase
      .dashboardTabs(dId)
      .orderBy("createdAt")
      .onSnapshot(tabsSnapshot => {
        const { selectedTab } = this.state;
        const { match } = this.props;

        if (tabsSnapshot.size) {
          let tabs = [];
          tabsSnapshot.forEach(doc =>
            tabs.push({ ...doc.data(), uid: doc.id })
          );
          const preferredTabId = selectedTab
            ? selectedTab.uid
            : match.params.tabId;
          const foundTab = tabs.find(tab => tab.uid === preferredTabId);
          this.setState({
            tabs: tabs,
            loading: false,
            selectedTab: foundTab ? foundTab : tabs[0]
          });
        } else {
          firebase.tabs().add({
            name: "My Tab",
            dashboardId: dId,
            feeds: [],
            userId: authUser.uid,
            createdAt: firebase.fieldValue.serverTimestamp()
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
    const { authUser, match, history } = this.props;

    return (
      <Fragment>
        {loading && <div>Loading ...</div>}
        {dashboards && (
          <Fragment>
            <Tabs
              tabs={tabs}
              dashboardId={match.params.dashboardId}
              authUser={authUser}
              selectedTab={selectedTab}
              setActiveTab={activeTab => {
                const tab = activeTab || tabs[0];
                this.setState({ selectedTab: tab }, () => {
                  history.push(
                    `${ROUTES.DASHBOARDS}/${match.params.dashboardId}/${tab.uid}`
                  );
                });
              }}
            />
            {dashboards && dashboards.length > 1 && (
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
            )}
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
