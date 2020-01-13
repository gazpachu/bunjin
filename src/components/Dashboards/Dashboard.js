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
import AddFeed from "../Feeds/AddFeed";
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
      loadingDashboard: false,
      loadingFeeds: false,
      dashboards: null,
      tabs: [],
      feeds: [],
      selectedDashboard: match.params.dashboardId,
      selectedTab: null
    };
  }

  componentDidMount() {
    this.loadDashbobards();
    this.loadTabs();
    this.loadTab();
  }

  componentWillUnmount() {
    this.unsubscribeDashboards && this.unsubscribeDashboards();
    this.unsubscribeTabs && this.unsubscribeTabs();
    this.unsubscribeTab && this.unsubscribeTab();
  }

  handleChange = event => {
    const { history } = this.props;
    this.setState({ selectedDashboard: event.target.value });
    history.push(`${ROUTES.DASHBOARDS}/${event.target.value}`);
    this.loadTabs(event.target.value);
  };

  loadDashbobards = () => {
    const { match, authUser, firebase } = this.props;
    this.setState({ loadingDashboard: true });

    if (authUser && match.params.dashboardId) {
      this.unsubscribeDashboards = firebase
        .dashboards(authUser.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot(dashboardsSnapshot => {
          console.log("Loaded Dashboards");
          if (dashboardsSnapshot.size) {
            let dashboards = [];
            dashboardsSnapshot.forEach(doc =>
              dashboards.push({ ...doc.data(), uid: doc.id })
            );

            this.setState({
              dashboards: dashboards.reverse(),
              loadingDashboard: false
            });
          } else {
            this.setState({ dashboards: null, loadingDashboard: false });
          }
        });
    }
  };

  loadTabs(id) {
    const { match, authUser, firebase } = this.props;
    const dId = id || match.params.dashboardId;
    this.setState({ loadingDashboard: true });

    this.unsubscribeTabs = firebase
      .dashboardTabs(dId)
      .orderBy("createdAt")
      .onSnapshot(tabsSnapshot => {
        console.log("Loaded Tabs");
        if (tabsSnapshot.size) {
          let tabs = [];
          tabsSnapshot.forEach(doc =>
            tabs.push({ ...doc.data(), uid: doc.id })
          );
          this.setState({ tabs, loadingDashboard: false });
        } else {
          firebase.tabs().add({
            name: "My Tab",
            dashboardId: dId,
            feeds: [],
            userId: authUser.uid,
            createdAt: firebase.fieldValue.serverTimestamp()
          });
          this.setState({ tabs: null, loadingDashboard: false });
        }
      });
  }

  loadTab = tab => {
    const { match, firebase, history } = this.props;
    const { tabs, selectedTab } = this.state;
    this.setState({ loadingFeeds: true });

    if (!tabs) return;

    const tabId =
      (tab && tab.uid) ||
      (selectedTab && selectedTab.uid) ||
      match.params.tabId ||
      tabs[0].uid;

    history.push(`${ROUTES.DASHBOARDS}/${match.params.dashboardId}/${tabId}`);

    this.unsubscribeTab = firebase.tab(tabId).onSnapshot(tabSnapshot => {
      console.log("Loaded Tab");
      if (tabSnapshot.exists) {
        const selectedTab = tabSnapshot.data();
        this.setState({ selectedTab, loadingFeeds: false }, () => {
          this.loadFeeds();
        });
      } else {
        this.setState({ selectedTab: null, loadingFeeds: false });
      }
    });
  };

  loadFeeds = () => {
    const { firebase } = this.props;
    const { selectedTab } = this.state;
    this.setState({ loadingFeeds: true });

    if (!selectedTab) return;

    firebase
      .tabFeeds(selectedTab.uid)
      .get()
      .then(snapshot => {
        console.log("Loaded Feeds");
        if (snapshot.size) {
          let feeds = selectedTab.feeds.filter(feed =>
            snapshot.docs.find(item => item.id === feed.uid)
          );
          feeds = feeds.map(feed => {
            const foundFeed = snapshot.docs.find(item => item.id === feed.uid);
            return { ...foundFeed.data(), uid: foundFeed.id };
          });
          this.setState({
            feeds,
            loadingFeeds: false
          });
        } else {
          this.setState({ feeds: null, loadingFeeds: false });
        }
      });
  };

  render() {
    const {
      loadingDashboard,
      loadingFeeds,
      dashboards,
      tabs,
      selectedDashboard,
      selectedTab,
      feeds
    } = this.state;
    const { authUser, match } = this.props;

    return (
      <Fragment>
        {loadingDashboard && <div>Loading dashboard...</div>}
        {dashboards && (
          <Fragment>
            <Tabs
              tabs={tabs}
              dashboardId={match.params.dashboardId}
              authUser={authUser}
              selectedTab={selectedTab}
              setActiveTab={activeTab => this.loadTab(activeTab)}
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
            {loadingFeeds && <div>Loading feeds...</div>}
            <Feeds
              feeds={feeds}
              selectedTab={selectedTab}
              setActiveTab={tab => this.setState({ selectedTab: tab })}
            />
            <AddFeed selectedTab={selectedTab} reloadFeeds={this.loadFeeds} />
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
