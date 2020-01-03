import React, { Component, Fragment } from "react";
import { withFirebase } from "../Firebase";
import { TabsNav, TabItem, NewTabItem, NewTabForm } from "./styles";
import { FormInput, Button } from "../../common/common.styles";

class NewTabBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      isAddTabFormActive: false
    };
  }

  onChangeName = event => {
    this.setState({ name: event.target.value });
  };

  onCreateTab = (event, authUser) => {
    const { dashboardId } = this.props;

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
  };

  render() {
    const { tab, authUser } = this.props;
    const { name, isAddTabFormActive } = this.state;

    return (
      <Fragment>
        <NewTabItem
          onClick={() =>
            this.setState({ isAddTabFormActive: !isAddTabFormActive })
          }
        >
          {tab && tab.name}
        </NewTabItem>
        {isAddTabFormActive && (
          <NewTabForm onSubmit={event => this.onCreateTab(event, authUser)}>
            <FormInput
              type="text"
              value={name}
              autoFocus
              onChange={this.onChangeName}
              placeholder="Tab name"
            />
            <Button type="submit">Add new tab</Button>
          </NewTabForm>
        )}
      </Fragment>
    );
  }
}

const NewTab = withFirebase(NewTabBase);

const Tab = ({ tab, isActive, setActiveTab }) => (
  <TabItem isActive={isActive} onClick={() => setActiveTab(tab.uid)}>
    {tab && tab.name}
  </TabItem>
);

const Tabs = ({ tabs, dashboardId, authUser, selectedTab, setActiveTab }) => (
  <TabsNav>
    {tabs &&
      tabs.map((tab, index) => (
        <Tab
          key={tab.uid}
          tab={tab}
          isActive={selectedTab === tab.uid}
          setActiveTab={setActiveTab}
        />
      ))}
    <NewTab authUser={authUser} tab={{ name: "+" }} dashboardId={dashboardId} />
  </TabsNav>
);

export default Tabs;
