import React, { Component } from "react";
import {
  FeedBox,
  FeedWrapper,
  FeedList,
  FeedItem,
  ExternalLink,
  Title,
  Snippet
} from "./styles";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      feed: null
    };
  }

  componentDidMount() {
    const { feed, parser } = this.props;
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    if (feed && parser) {
      parser.parseURL("http://localhost:3000/feed.xml", (err, feed) => {
        if (err) throw err;
        this.setState({ feed });
      });
    }
  }

  render() {
    const { feed } = this.state;
    console.log(feed);
    return (
      <FeedBox>
        <FeedWrapper>
          <FeedList>
            {feed &&
              feed.items.map(item => (
                <FeedItem key={item.guid}>
                  <ExternalLink
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${item.title} - ${item.contentSnippet}`}
                  >
                    <Title>{item.title}</Title> -{" "}
                    <Snippet>{item.contentSnippet}</Snippet>
                  </ExternalLink>
                </FeedItem>
              ))}
          </FeedList>
        </FeedWrapper>
      </FeedBox>
    );
  }
}

export default Feed;
