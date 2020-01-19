import React, { Component } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
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
    if (prevProps.tab !== this.props.tab && this.props.tab) {
      this.setState({ name: this.props.tab.name });
    }
    if (prevProps.isAddNew !== this.props.isAddNew) {
      this.setState({ name: this.props.isAddNew ? "" : this.props.tab.name });
    }
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      this.nameInput.focus();
    }
  }

  onChangeName = event => {
    this.setState({ name: event.target.value });
  };

  onCreateTab = event => {
    const {
      dashboardId,
      authUser,
      toggleSettings,
      firebase,
      history,
      match
    } = this.props;

    if (dashboardId && authUser) {
      const newTab = {
        name: this.state.name,
        dashboardId: dashboardId,
        userId: authUser.uid,
        feeds: [],
        createdAt: firebase.fieldValue.serverTimestamp()
      };
      firebase
        .tabs()
        .add(newTab)
        .then(createdTab => {
          console.log(createdTab.id);
          return history.push(
            `${ROUTES.DASHBOARDS}/${match.params.dashboardId}/${createdTab.id}`
          );
        });

      this.setState({ name: "", isAddTabFormActive: false });
    }

    event.preventDefault();
    toggleSettings();
  };

  onEditTab = event => {
    const { tab, toggleSettings, firebase } = this.props;
    const { name } = this.state;

    if (!tab || !tab.id) return;

    firebase.tab(tab.id).update({
      ...tab,
      name,
      editedAt: firebase.fieldValue.serverTimestamp()
    });

    this.setState({ name: "" });

    event.preventDefault();
    toggleSettings();
  };

  onRemoveTab = () => {
    const { tab, toggleSettings, firebase, history, match } = this.props;

    if (!tab || !tab.id) return;

    firebase
      .tab(tab.id)
      .delete()
      .then(() => {
        firebase
          .tabFeeds(tab.id)
          .get()
          .then(snapshot => {
            if (snapshot.size) {
              firebase.feed(snapshot.docs[0].id).delete();
            } else if (snapshot.size) {
              const batch = firebase.db.batch();
              snapshot.docs.map(doc => {
                const data = doc.data();
                const index = data.tabs.indexOf(tab.id);
                data.tabs.splice(index, 1);

                return batch.update(doc.ref, { ...data });
              });
              batch.commit();
            }
            history.push(`${ROUTES.DASHBOARDS}/${match.params.dashboardId}`);
          });
      });

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
            ref={input => {
              this.nameInput = input;
            }}
            onChange={this.onChangeName}
            placeholder="Tab name"
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

export default compose(withRouter, withFirebase)(TabSettings);
