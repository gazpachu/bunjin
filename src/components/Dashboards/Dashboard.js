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
import Spinner from "../Spinner";
import { DashboardSelect } from "./styles";

const DashboardPage = ({ match }) => (
  <AuthUserContext.Consumer>
    {authUser => <Dashboard authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class DashboardBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingDashboard: false,
      loadingFeeds: false,
      tabs: [],
      feeds: [],
      selectedTab: null,
      dashboard: this.props.dashboard
    };
  }

  componentDidMount() {
    console.log("Dashboard mounted");
    const { dashboard } = this.state;
    const { match } = this.props;
    if (!dashboard && match.params && match.params.dashboardId) {
      this.loadDashbobard(match.params.dashboardId);
    }
  }

  componentWillUnmount() {
    this.unsubscribeTabs && this.unsubscribeTabs();
    this.unsubscribeTab && this.unsubscribeTab();
  }

  handleChange = event => {
    const { history } = this.props;
    this.setState({ selectedDashboard: event.target.value });
    history.push(`${ROUTES.DASHBOARDS}/${event.target.value}`);
    this.loadTabs(event.target.value);
  };

  loadDashbobard = id => {
    const { firebase } = this.props;
    this.setState({ loadingDashboard: true });

    firebase
      .dashboard(id)
      .get()
      .then(dashboard => {
        if (dashboard.exists) {
          console.log("Loaded Dashboard");
          this.setState(
            { dashboard: dashboard.data(), loadingDashboard: false },
            () => {
              this.loadTabs(id);
            }
          );
        } else {
          console.log("Dashboard doesn't exist");
          this.setState({ dashboards: null, loadingDashboard: false });
        }
      });
  };

  loadTabs(id) {
    const { authUser, firebase } = this.props;
    this.setState({ loadingDashboard: true });

    this.unsubscribeTabs = firebase
      .dashboardTabs(id)
      .orderBy("createdAt")
      .onSnapshot(tabsSnapshot => {
        if (tabsSnapshot.size) {
          console.log("Loaded Tabs");
          let tabs = [];
          tabsSnapshot.forEach(doc =>
            tabs.push({ ...doc.data(), uid: doc.id })
          );
          this.setState({ tabs, loadingDashboard: false }, () =>
            this.loadTab()
          );
        } else {
          console.log("Created new tab");
          firebase
            .tabs()
            .add({
              name: "My Tab",
              dashboardId: id,
              feeds: [],
              userId: authUser.uid,
              createdAt: firebase.fieldValue.serverTimestamp()
            })
            .then(addedTab => {
              this.setState(
                { tabs: addedTab.data(), loadingDashboard: false },
                () => this.loadTab()
              );
            });
        }
      });
  }

  loadTab = id => {
    const { match, firebase, history } = this.props;
    const { tabs, selectedTab } = this.state;
    this.setState({ loadingFeeds: true });

    if (tabs.length === 0) return;

    let tabId = tabs[0].uid;
    if (match.params && match.params.tabId) tabId = match.params.tabId;
    if (selectedTab && selectedTab.uid) tabId = selectedTab.uid;
    if (id) tabId = id;
    if (!tabId) return;

    if (!match.params || !match.params.tabId) {
      history.push(`${ROUTES.DASHBOARDS}/${match.params.dashboardId}/${tabId}`);
      return;
    }

    this.unsubscribeTab = firebase.tab(tabId).onSnapshot(tabSnapshot => {
      if (tabSnapshot.exists) {
        console.log("Loaded Tab");
        const selectedTab = tabSnapshot.data();
        this.setState({ selectedTab, loadingFeeds: false }, () => {
          this.loadFeeds();
        });
      } else {
        console.log("Tab doesn't exist");
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
        if (snapshot.size) {
          console.log("Loaded Feeds");
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
          console.log("Feeds not found");
          this.setState({ feeds: null, loadingFeeds: false });
        }
      });
  };

  render() {
    const {
      loadingDashboard,
      loadingFeeds,
      dashboard,
      tabs,
      selectedTab,
      feeds
    } = this.state;
    const { authUser, match } = this.props;

    return (
      <Fragment>
        {dashboard && (
          <Fragment>
            <Tabs
              tabs={tabs}
              dashboardId={match.params.dashboardId}
              authUser={authUser}
              selectedTab={selectedTab}
              setActiveTab={activeTab => this.loadTab(activeTab.uid)}
            />
            {/* {dashboards && dashboards.length > 1 && (
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
            )} */}
            {(loadingDashboard || loadingFeeds) && <Spinner centered />}
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
