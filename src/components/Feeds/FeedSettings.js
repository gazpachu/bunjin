import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Button } from "../../common/common.styles";
import { FeedSettingsWrapper, FeedSettingsForm, OrderInput } from "./styles";

class FeedSettings extends Component {
  constructor(props) {
    super(props);
    const { feed } = this.props;

    this.state = {
      order: feed ? feed.order : 1
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.feed !== this.props.feed) {
      this.setState({ order: this.props.feed.order });
    }
  }

  onChangeOrder = event => {
    this.setState({ order: event.target.value });
  };

  onEditFeed = event => {
    const { feed, firebase } = this.props;
    const { order } = this.state;

    if (!feed) return;

    firebase.feed(feed.uid).update({
      ...feed,
      order,
      editedAt: firebase.fieldValue.serverTimestamp()
    });

    this.setState({ order: "" });

    event.preventDefault();
  };

  onRemoveFeed = () => {
    const { feed, tab, firebase } = this.props;

    if (!feed) return;
    if (feed.tabs.length > 1) {
      const updatedFeed = { ...feed };
      const index = updatedFeed.tabs.indexOf(tab.uid);
      updatedFeed.tabs.splice(index, 1);

      firebase.feed(feed.uid).update({
        ...updatedFeed,
        editedAt: firebase.fieldValue.serverTimestamp()
      });
    } else {
      firebase.feed(feed.uid).delete();
    }
  };

  render() {
    const { isActive } = this.props;
    const { order } = this.state;

    return (
      <FeedSettingsWrapper isActive={isActive}>
        <FeedSettingsForm onSubmit={event => this.onEditFeed(event)}>
          <OrderInput
            type="number"
            value={order}
            onChange={this.onChangeOrder}
            autoFocus
          />
          <Button type="submit">Change order</Button>
        </FeedSettingsForm>
        <Button color="red" onClick={this.onRemoveFeed}>
          Remove feed
        </Button>
      </FeedSettingsWrapper>
    );
  }
}

export default withFirebase(FeedSettings);
