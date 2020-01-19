import React, { Component, Fragment } from "react";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { AddFeedForm, AddFeedInput, AddFeedButton } from "./styles";
import Spinner from "../Spinner/";

class AddFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      loading: false
    };
  }

  onChangeUrl = event => {
    this.setState({ url: event.target.value });
  };

  onCreateFeed = (event, authUser) => {
    const { firebase, selectedTab } = this.props;
    const { url } = this.state;

    if (!selectedTab || !selectedTab.id) {
      console.log("Wrong tab or tab id");
      return;
    }

    this.setState({ loading: true });
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
              tabs: [selectedTab.id],
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
          if (data.tabs.indexOf(selectedTab.id) === -1) {
            data.tabs.push(selectedTab.id);
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
          } else {
            this.addFeedToTab(snapshot.docs[0].id);
          }
        }
      });

    this.setState({ url: "" });
    event.preventDefault();
  };

  addFeedToTab = feedId => {
    const { firebase, selectedTab } = this.props;

    if (feedId) {
      const feeds = selectedTab.feeds ? [...selectedTab.feeds] : [];
      feeds.push({
        uid: feedId,
        order: 1
      });

      firebase
        .tab(selectedTab.id)
        .update({
          ...selectedTab,
          feeds,
          editedAt: firebase.fieldValue.serverTimestamp()
        })
        .then(() => {
          console.log("Added new feed");
          this.setState({ loading: false });
        })
        .catch(() => this.setState({ loading: false }));
    }
  };

  render() {
    const { url, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Fragment>
            {loading && <Spinner centered />}
            {!loading && (
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
            )}
          </Fragment>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(AddFeed);
