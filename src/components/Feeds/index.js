import React, { Component, Fragment } from "react";
import rssParser from "rss-parser";
import Feed from "./Feed";
import { Form, FormInput, Button } from "../../common/common.styles";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { FeedGrid } from "./styles";

class Feeds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      loading: false,
      feeds: []
    };

    this.parser = new rssParser();
  }

  componentDidMount() {
    this.onListenForFeeds();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedTab !== this.props.selectedTab) {
      this.onListenForFeeds();
    }
  }

  onListenForFeeds = () => {
    const { selectedTab } = this.props;

    if (selectedTab) {
      this.setState({ loading: true });

      this.unsubscribe = this.props.firebase
        .tabFeeds(selectedTab)
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
    this.unsubscribe();
  }

  onChangeUrl = event => {
    this.setState({ url: event.target.value });
  };

  onCreateFeed = (event, authUser) => {
    const { selectedTab } = this.props;

    this.props.firebase.feeds().add({
      url: this.state.url,
      tabId: selectedTab,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ url: "" });

    event.preventDefault();
  };

  onEditFeed = (feed, url) => {
    const { uid, ...feedSnapshot } = feed;

    this.props.firebase.feed(feed.uid).update({
      ...feedSnapshot,
      url,
      editedAt: this.props.firebase.fieldValue.serverTimestamp()
    });
  };

  onRemoveFeed = uid => {
    this.props.firebase.feed(uid).delete();
  };

  render() {
    const { url, feeds, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Fragment>
            {loading && <div>Loading ...</div>}

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

            <Form onSubmit={event => this.onCreateFeed(event, authUser)}>
              <FormInput
                type="text"
                value={url}
                onChange={this.onChangeUrl}
                placeholder="Feed URL"
              />
              <Button type="submit">Add new feed</Button>
            </Form>
          </Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Feeds);
