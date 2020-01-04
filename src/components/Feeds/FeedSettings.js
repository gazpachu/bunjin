import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Button } from "../../common/common.styles";
import { FeedSettingsWrapper, FeedSettingsForm, OrderInput } from "./styles";

class FeedSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: 1
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
    const { feed } = this.props;
    const { order } = this.state;

    if (!feed) return;

    this.props.firebase.feed(feed.uid).update({
      ...feed,
      order,
      editedAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ order: "" });

    event.preventDefault();
  };

  onRemoveFeed = () => {
    const { feed } = this.props;
    if (!feed) return;
    this.props.firebase.feed(feed.uid).delete();
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
