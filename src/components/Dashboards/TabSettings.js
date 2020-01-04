import React, { Component } from "react";
import { withFirebase } from "../Firebase";
import { Button } from "../../common/common.styles";
import { TabSettingsWrapper, TabSettingsForm, TabNameInput } from "./styles";

class TabSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tab !== this.props.tab) {
      this.setState({ name: this.props.tab.name });
    }
  }

  onChangeName = event => {
    this.setState({ name: event.target.value });
  };

  onCreateTab = event => {
    const { dashboardId, authUser, toggleSettings } = this.props;

    if (dashboardId && authUser) {
      this.props.firebase.tabs().add({
        name: this.state.name,
        dashboardId: dashboardId,
        userId: authUser.uid,
        createdAt: this.props.firebase.fieldValue.serverTimestamp()
      });

      this.setState({ name: "", isAddTabFormActive: false });
    }

    event.preventDefault();
    toggleSettings();
  };

  onEditTab = event => {
    const { tab, toggleSettings } = this.props;
    const { name } = this.state;

    if (!tab) return;

    this.props.firebase.tab(tab.uid).update({
      ...tab,
      name,
      editedAt: this.props.firebase.fieldValue.serverTimestamp()
    });

    this.setState({ name: "" });

    event.preventDefault();
    toggleSettings();
  };

  onRemoveTab = () => {
    const { tab, toggleSettings } = this.props;
    if (!tab) return;
    this.props.firebase
      .tab(tab.uid)
      .delete()
      .then(() =>
        this.props.firebase.tabFeeds(tab.uid).onSnapshot(snapshot => {
          if (snapshot.size) {
            snapshot.forEach(doc => {
              doc.ref.delete();
            });
          }
        })
      );

    toggleSettings();
  };

  render() {
    const { isActive, isAddNew } = this.props;
    const { name } = this.state;

    return (
      <TabSettingsWrapper isActive={isActive}>
        <TabSettingsForm
          onSubmit={event => {
            isAddNew ? this.onCreateTab(event) : this.onEditTab(event);
          }}
        >
          <TabNameInput
            type="text"
            value={name}
            onChange={this.onChangeName}
            placeholder="Tab name"
            autoFocus
          />
          <Button type="submit">{isAddNew ? "Add new" : "Rename"} tab</Button>
        </TabSettingsForm>
        {!isAddNew && (
          <Button color="red" onClick={this.onRemoveTab}>
            Remove tab
          </Button>
        )}
      </TabSettingsWrapper>
    );
  }
}

export default withFirebase(TabSettings);
