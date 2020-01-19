import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Button } from "../../common/common.styles";
import {
  FeedSettingsWrapper,
  FeedSettingsForm,
  OrderLabel,
  OrderSelect
} from "./styles";

class FeedSettings extends Component {
  constructor(props) {
    super(props);
    const { tab, feed } = this.props;
    const order =
      tab.feeds && feed
        ? tab.feeds.find(item => item.uid === feed.uid).order
        : 1;

    this.state = {
      selectedOrder: order,
      options: this.buildOptions()
    };
  }

  buildOptions = () => {
    const { tab } = this.props;
    const options = [];
    for (let i = 1; i < (tab.feeds.length || 0) + 1; i += 1) {
      options.push({ label: i, value: i });
    }
    return options;
  };

  handleChange = event => {
    this.setState({ selectedOrder: event.target.value });
    const { tab, feed, firebase } = this.props;

    if (!tab) return;

    tab.feeds.find(item => item.uid === feed.uid).order = parseInt(
      event.target.value
    );

    tab.feeds.sort((a, b) => {
      let comparison = 0;
      if (a.order > b.order) {
        comparison = 1;
      } else if (a.order < b.order) {
        comparison = -1;
      }
      return comparison;
    });

    firebase.tab(tab.uid).update({
      ...tab,
      editedAt: firebase.fieldValue.serverTimestamp()
    });
  };

  onRemoveFeed = () => {
    const { feed, tab, firebase, closeSettings } = this.props;

    if (!feed) return;

    const updatedTab = { ...tab };
    const index = updatedTab.feeds.findIndex(x => x.uid === feed.uid);
    updatedTab.feeds.splice(index, 1);

    firebase
      .tab(tab.uid)
      .update({
        ...updatedTab,
        editedAt: firebase.fieldValue.serverTimestamp()
      })
      .catch(error => console.log(error));

    if (updatedTab.feeds.findIndex(x => x.uid === feed.uid) === -1) {
      if (feed.tabs.length > 1) {
        const updatedFeed = { ...feed };
        const index = updatedFeed.tabs.indexOf(tab.uid);
        updatedFeed.tabs.splice(index, 1);

        firebase
          .feed(feed.uid)
          .update({
            ...updatedFeed,
            editedAt: firebase.fieldValue.serverTimestamp()
          })
          .catch(error => console.log(error));
      } else {
        firebase
          .feed(feed.uid)
          .delete()
          .catch(error => console.log(error));
      }
    }

    closeSettings();
  };

  render() {
    const { isActive } = this.props;
    const { selectedOrder, options } = this.state;

    return (
      <FeedSettingsWrapper isActive={isActive}>
        <FeedSettingsForm onSubmit={event => this.onEditFeed(event)}>
          <OrderLabel>Order</OrderLabel>
          <OrderSelect value={selectedOrder} onChange={this.handleChange}>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </OrderSelect>
        </FeedSettingsForm>
        <Button color="red" onClick={this.onRemoveFeed}>
          Remove feed
        </Button>
      </FeedSettingsWrapper>
    );
  }
}

export default withFirebase(FeedSettings);
