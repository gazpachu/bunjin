import styled from "styled-components";
import {
  colors,
  spacing,
  fontSizes,
  Form,
  FormInput,
  Select,
  Button,
  breakpoints
} from "../../common/common.styles";
import { ReactComponent as CogSvg } from "../../assets/img/cog.svg";

export const GridWrapper = styled.div`
  padding-top: ${spacing.l3};
`;

export const FeedGrid = styled.div`
  display: grid;
  grid-gap: ${spacing.l3};
  grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));

  @media (min-width: ${breakpoints.mobile}) {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  }
`;

export const AddFeedForm = styled(Form)`
  margin: ${spacing.l5} auto;
  display: flex;
  align-items: center;
  max-width: 500px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    padding: ${spacing.l3};
    margin: ${spacing.l3} auto;
  }
`;

export const AddFeedInput = styled(FormInput)`
  margin-bottom: 0;
  margin-right: ${spacing.l2};
  flex-grow: 2;

  @media (max-width: ${breakpoints.mobile}) {
    margin-right: 0;
    margin-bottom: ${spacing.l2};
    flex-grow: 1;
  }
`;

export const AddFeedButton = styled(Button)`
  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export const FeedBox = styled.div`
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;
  background-color: rgba(0, 0, 0, 0.2);
  text-align: left;

  @media (min-width: ${breakpoints.mobile}) {
    border-radius: 5px;
  }
`;

export const FeedHeader = styled.div`
  height: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: ${spacing.l2} ${spacing.l3};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${breakpoints.mobile}) {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
`;

export const FeedImage = styled.img`
  width: 16px;
  height: 16px;
  vertical-align: sub;
  border-radius: 3px;
  margin-right: ${spacing.l2};
`;

export const FeedTitle = styled.span`
  font-size: ${fontSizes.l5};
`;

export const FeedWrapper = styled.div`
  padding: ${spacing.l2} 0;
  height: 200px;
  overflow: scroll;
  font-size: ${fontSizes.l5};
  line-height: 1.2em;
`;

export const FeedList = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
`;

export const FeedItem = styled.li`
  padding: ${spacing.l1} ${spacing.l3};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const ExternalLink = styled.a`
  text-decoration: none;
`;

export const ItemTitle = styled.span``;

export const Snippet = styled.span`
  color: ${colors.secondary};
`;

export const Error = styled.span`
  padding: ${spacing.l1} ${spacing.l3};
`;

export const SettingsButton = styled.button``;

export const SettingsIcon = styled(CogSvg)`
  fill: white;
  width: 16px;
  height: 16px;
`;

export const FeedSettingsWrapper = styled.div`
  display: none;
  padding: 0 ${spacing.l3};

  ${({ isActive }) =>
    isActive &&
    `
    display: block;
  `};
`;

export const FeedSettingsForm = styled(Form)`
  max-width: initial;
  margin: initial;
`;

export const OrderLabel = styled.span`
  margin-right: ${spacing.l2};
`;

export const OrderSelect = styled(Select)`
  width: 60px;
  margin-right: ${spacing.l2};
  margin-bottom: ${spacing.l2};
`;
