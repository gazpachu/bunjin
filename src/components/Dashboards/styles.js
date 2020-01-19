import styled from "styled-components";
import { breakpoints, spacing, Select } from "../../common/common.styles";

export const DashboardList = styled.ul`
  padding: 0;
  list-style-type: none;
`;

export const DashboardButton = styled.button`
  width: 100%;
  margin-bottom: ${spacing.l2};
`;

export const DashboardSelect = styled(Select)`
  position: absolute;
  text-align-last: right;
  top: 6px;
  right: 70px;

  @media (max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;
