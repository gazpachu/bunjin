import styled from "styled-components";
import { colors, spacing, Select } from "../../common/common.styles";

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
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const DashboardSelect = styled(Select)`
  position: absolute;
  text-align-last: right;
  top: 6px;
  right: 70px;
`;
