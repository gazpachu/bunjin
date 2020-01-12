import React, { Component } from "react";
import rssParser from "rss-parser";
import Feed from "./Feed";
import { PageContainer } from "../../common/common.styles";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import {
  GridWrapper,
  FeedGrid,
  AddFeedForm,
  AddFeedInput,
  AddFeedButton
} from "./styles";

class Feeds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      loading: true,
      updating: false,
      feeds: []
    };

    this.parser = new rssParser({
      defaultRSS: 2.0
    });
  }

  componentDidMount() {
    this.onListenForFeeds();
  }

  componentDidUpdate(prevProps) {
    if (
      (prevProps.selectedTab &&
        prevProps.selectedTab.uid !== this.props.selectedTab.uid) ||
      (!prevProps.selectedTab && this.props.selectedTab)
    ) {
      this.onListenForFeeds();
    }
  }

  onListenForFeeds = () => {
    const { selectedTab, firebase } = this.props;

    if (selectedTab) {
      this.unsubscribeFeeds = firebase
        .tabFeeds(selectedTab.uid)
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            let feeds = [];
            snapshot.forEach(doc => feeds.push({ ...doc.data(), uid: doc.id }));

            this.setState({
              feeds: feeds,
              loading: false
            });
          } else {
            this.setState({ feeds: null, loading: false });
          }
        });
    }
  };

  componentWillUnmount() {
    this.unsubscribeFeeds && this.unsubscribeFeeds();
  }

  onChangeUrl = event => {
    this.setState({ url: event.target.value });
  };

  onCreateFeed = (event, authUser) => {
    const { firebase, selectedTab } = this.props;
    const { url } = this.state;

    this.setState({ updating: true });
    console.log(url);
    firebase
      .findFeed(url)
      .get()
      .then(snapshot => {
        if (!snapshot.size) {
          firebase
            .feeds()
            .add({
              url,
              userId: authUser.uid,
              tabs: [selectedTab.uid],
              createdAt: firebase.getTimestamp()
            })
            .then(addedFeed => {
              this.addFeedToTab(addedFeed.id);
            })
            .catch(error => {
              this.setState({ updating: false });
            });
        } else {
          const data = snapshot.docs[0].data();
          data.tabs.push(selectedTab.uid);
          firebase
            .feed(snapshot.docs[0].id)
            .update({
              ...data,
              editedAt: firebase.fieldValue.serverTimestamp()
            })
            .then(addedFeed => {
              this.addFeedToTab(snapshot.docs[0].id);
            })
            .catch(error => {
              this.setState({ updating: false });
            });
        }
      });

    this.setState({ url: "" });
    event.preventDefault();
  };

  addFeedToTab = feedId => {
    const { firebase, selectedTab } = this.props;

    if (feedId) {
      const feeds = [...selectedTab.feeds];
      feeds.push({
        uid: feedId
      });

      firebase
        .tab(selectedTab.uid)
        .update({
          ...selectedTab,
          feeds,
          editedAt: firebase.fieldValue.serverTimestamp()
        })
        .then(() => this.setState({ updating: false }))
        .catch(() => this.setState({ updating: false }));
    }
  };

  render() {
    const { selectedTab } = this.props;
    const { url, feeds, loading } = this.state;

    if (loading) return <GridWrapper>Loading ...</GridWrapper>;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <PageContainer>
            <GridWrapper>
              {feeds && (
                <FeedGrid>
                  {feeds.map(feed => (
                    <Feed
                      authUser={authUser}
                      key={feed.uid}
                      feed={feed}
                      tab={selectedTab}
                      parser={this.parser}
                    />
                  ))}
                </FeedGrid>
              )}

              {!feeds && <div>There are no feeds ...</div>}

              <AddFeedForm
                onSubmit={event => this.onCreateFeed(event, authUser)}
              >
                <AddFeedInput
                  type="text"
                  value={url}
                  onChange={this.onChangeUrl}
                  placeholder="Feed URL"
                />
                <AddFeedButton type="submit">Add new feed</AddFeedButton>
              </AddFeedForm>
            </GridWrapper>
          </PageContainer>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Feeds);
