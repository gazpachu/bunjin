import styled from "styled-components";
import {
  colors,
  spacing,
  headerHeight,
  Form,
  FormInput
} from "../../common/common.styles";

export const TabsNav = styled.ul`
  padding: 0;
  list-style-type: none;
  margin: 0;
  text-align: left;
  display: flex;
  border-bottom: 1px solid ${colors.border};
`;

export const TabItem = styled.li`
  height: ${parseInt(headerHeight) - 1}px;
  line-height: ${parseInt(headerHeight) - 3}px;
  display: inline-block;
  padding: 0 ${spacing.l4};
  cursor: pointer;
  white-space: nowrap;
  color: white;

  &:last-child {
    width: 100%;
  }

  ${({ isActive }) =>
    !isActive &&
    `
    transition: all 0.5 ease;
    background-color: rgba(0,0,0,.2);
    color: grey;

    &:hover {
      color: white;
    }
  `}
`;

export const NewTabItem = styled(TabItem)`
  font-size: 30px;
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
    top: 19px;

    ${({ isActive }) => isActive && `transform: rotate(180deg);`}
  }
`;

export const TabSettingsWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${colors.border};
  background-color: ${colors.bg};
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
