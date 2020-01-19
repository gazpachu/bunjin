import React, { Fragment, useState } from "react";
import TabSettings from "./TabSettings";
import { TabsNav, TabItem, NewTabItem, ToggleSettings } from "./styles";

const Tab = ({
  tab,
  isActive,
  setActiveTab,
  toggleSettings,
  isSettingsActive
}) => (
  <TabItem isActive={isActive} onClick={() => setActiveTab(tab)}>
    {tab && tab.name}
    {isActive && (
      <ToggleSettings onClick={toggleSettings} isActive={isSettingsActive} />
    )}
  </TabItem>
);

const Tabs = ({ tabs, dashboardId, authUser, selectedTab, setActiveTab }) => {
  const [isSettingsActive, toggleSettings] = useState(false);
  const [isAddNew, toggleAddNew] = useState(false);

  return (
    <Fragment>
      <TabsNav>
        {tabs &&
          selectedTab &&
          tabs.map((tab, index) => (
            <Tab
              key={tab.id}
              tab={tab}
              isActive={!isAddNew && selectedTab.id === tab.id}
              isSettingsActive={isSettingsActive}
              setActiveTab={tab => {
                setActiveTab(tab);
                toggleSettings(false);
                toggleAddNew(false);
              }}
              toggleSettings={event => {
                toggleSettings(!isSettingsActive);
                toggleAddNew(false);
                event.stopPropagation();
              }}
            />
          ))}
        <NewTabItem
          isActive={isAddNew}
          onClick={() => {
            toggleSettings(!isSettingsActive);
            toggleAddNew(true);
          }}
        >
          +
        </NewTabItem>
      </TabsNav>
      <TabSettings
        tab={selectedTab}
        isActive={isSettingsActive}
        dashboardId={dashboardId}
        authUser={authUser}
        isAddNew={isAddNew}
        toggleSettings={toggleSettings}
      />
    </Fragment>
  );
};

export default Tabs;
