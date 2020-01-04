import styled from "styled-components";
import { darken } from "polished";
import {
  colors,
  spacing,
  headerHeight,
  Select,
  Form,
  FormInput
} from "../../common/common.styles";

export const DashboardList = styled.ul`
  padding: 0;
  list-style-type: none;
`;

export const DashboardButton = styled.button`
  width: 100%;
  color: white;
  border: 1px solid ${colors.border};
  background-color: ${colors.bg2};
  margin-bottom: ${spacing.l2};

  &:hover {
    background-color: ${darken(0.04, colors.bg)};
  }
`;

export const DashboardSelect = styled(Select)`
  position: absolute;
  text-align-last: right;
  top: 6px;
  right: 70px;
`;

export const TabsNav = styled.ul`
  padding: 0;
  list-style-type: none;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0 auto 0 ${spacing.l3};
`;

export const TabItem = styled.li`
  line-height: ${parseInt(headerHeight) - 10}px;
  border-style: solid;
  border-color: ${colors.border};
  border-width: 1px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: inline-block;
  padding: 2px 10px 0 10px;
  background-color: ${colors.bg};
  margin: 6px ${spacing.l1} 0 ${spacing.l1};
  vertical-align: bottom;
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    `
    border-bottom-width: 0;
    padding-top: 3px;
  `}
`;

export const NewTabItem = styled(TabItem)`
  font-size: 30px;
  border-width: 1px;
  padding-top: 2px;

  ${({ isActive }) =>
    isActive &&
    `
    border-bottom-width: 0;
    padding-top: 3px;
  `}
`;

export const NewTabForm = styled(Form)`
  margin-top: ${spacing.l2};
  position: absolute;
  min-width: 300px;
  background-color: ${colors.bg};
  padding: ${spacing.l3};
  border: 1px solid ${colors.border};
`;

export const ToggleSettings = styled.button`
  width: 15px;
  height: 15px;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid white;
    position: absolute;
    top: 25px;

    ${({ isActive }) => isActive && `transform: rotate(180deg);`}
  }
`;

export const TabSettingsWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${colors.border};
  position: absolute;
  background-color: ${colors.bg};
  left: 0;
  padding: ${spacing.l3};
  display: none;
  align-items: flex-start;
  justify-content: space-between;

  ${({ isActive }) =>
    isActive &&
    `
    display: flex;
  `}
`;

export const TabSettingsForm = styled(Form)`
  width: auto;
  max-width: initial;
  margin: initial;
`;

export const TabNameInput = styled(FormInput)`
  max-width: 200px;
  margin-right: ${spacing.l2};
  margin-bottom: 0;
`;
