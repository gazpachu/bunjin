import React, { Component } from "react";
import { Form, FormInput, Button, Overlay } from "../../common/common.styles";

class TabSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  onChangeName = event => {
    this.setState({ name: event.target.value });
  };

  onCreateTab = (event, authUser) => {
    this.props.firebase.tabs().add({
      name: this.state.name,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ name: "" });

    event.preventDefault();
  };

  onEditTab = (tab, name) => {
    const { uid, ...tabSnapshot } = tab;

    this.props.firebase.tab(tab.uid).update({
      ...tabSnapshot,
      name,
      editedAt: this.props.firebase.fieldValue.serverTimestamp()
    });
  };

  onRemoveTab = uid => {
    this.props.firebase.tab(uid).delete();
  };

  render() {
    const { authUser } = this.props;
    const { name } = this.state;

    return (
      <Overlay>
        <Form onSubmit={event => this.onCreateTabb(event, authUser)}>
          <FormInput type="text" value={name} onChange={this.onChangeName} />
          <Button type="submit">Send</Button>
        </Form>
      </Overlay>
    );
  }
}

export default TabSettings;
