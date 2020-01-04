import React, { Component } from "react";
import rssParser from "rss-parser";
import Feed from "./Feed";
import { PageContainer, Button } from "../../common/common.styles";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { GridWrapper, FeedGrid, AddFeedForm, AddFeedInput } from "./styles";

class Feeds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      loading: true,
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
    const { selectedTab } = this.props;

    if (selectedTab) {
      this.unsubscribe = this.props.firebase
        .tabFeeds(selectedTab.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot(snapshot => {
          if (snapshot.size) {
            let feeds = [];
            snapshot.forEach(doc => feeds.push({ ...doc.data(), uid: doc.id }));

            this.setState({
              feeds: feeds.reverse(),
              loading: false
            });
          } else {
            this.setState({ feeds: null, loading: false });
          }
        });
    }
  };

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  onChangeUrl = event => {
    this.setState({ url: event.target.value });
  };

  onCreateFeed = (event, authUser) => {
    const { selectedTab } = this.props;

    this.props.firebase.feeds().add({
      url: this.state.url,
      order: 1,
      tabId: selectedTab.uid,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ url: "" });

    event.preventDefault();
  };

  render() {
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
                <Button type="submit">Add new feed</Button>
              </AddFeedForm>
            </GridWrapper>
          </PageContainer>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Feeds);
