import styled from "styled-components";
import {
  colors,
  spacing,
  fontSizes,
  headerHeight,
  Select,
  Form
} from "../../common/common.styles";

export const FeedGrid = styled.div`
  display: grid;
  grid-gap: ${spacing.l3};
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
`;

export const FeedBox = styled.div`
  border-radius: 5px;
  border: 1px solid ${colors.border};
  text-align: left;
`;

export const FeedWrapper = styled.div`
  margin-bottom: ${spacing.l3};
  padding: ${spacing.l3} 0;
  max-height: 200px;
  overflow: scroll;
  font-size: ${fontSizes.l5};
  line-height: 1.5em;
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
    background-color: ${colors.bg2};
  }
`;

export const ExternalLink = styled.a`
  text-decoration: none;
`;

export const Title = styled.span``;

export const Snippet = styled.span`
  color: ${colors.secondary};
`;
