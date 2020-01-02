import React, { Component } from "react";
import { Form, FormInput, Button } from "../../common/common.styles";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import Feed from "./Feed";

class Feeds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
      feeds: [],
      limit: 5
    };
  }

  componentDidMount() {
    this.onListenForFeeds();
  }

  onListenForFeeds = () => {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .feeds()
      .orderBy("createdAt", "desc")
      .limit(this.state.limit)
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
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateFeed = (event, authUser) => {
    this.props.firebase.feeds().add({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ text: "" });

    event.preventDefault();
  };

  onEditFeed = (feed, text) => {
    const { uid, ...feedSnapshot } = feed;

    this.props.firebase.feed(feed.uid).update({
      ...feedSnapshot,
      text,
      editedAt: this.props.firebase.fieldValue.serverTimestamp()
    });
  };

  onRemoveFeed = uid => {
    this.props.firebase.feed(uid).delete();
  };

  onNextPage = () => {
    this.setState(state => ({ limit: state.limit + 5 }), this.onListenForFeeds);
  };

  render() {
    const { text, feeds, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && feeds && (
              <Button type="button" onClick={this.onNextPage}>
                More
              </Button>
            )}

            {loading && <div>Loading ...</div>}

            {feeds && (
              <ul>
                {feeds.map(feed => (
                  <Feed
                    authUser={authUser}
                    key={feed.uid}
                    message={feed}
                    onEditFeed={this.onEditFeed}
                    onRemoveFeed={this.onRemoveFeed}
                  />
                ))}
              </ul>
            )}

            {!feeds && <div>There are no feeds ...</div>}

            <Form onSubmit={event => this.onCreateFeed(event, authUser)}>
              <FormInput
                type="text"
                value={text}
                onChange={this.onChangeText}
              />
              <Button type="submit">Send</Button>
            </Form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Feeds);
