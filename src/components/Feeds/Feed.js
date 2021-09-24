import React, { Component, Fragment } from "react";
import dayjs from "dayjs";
import uniqBy from "lodash.uniqby";
import sanitizeHtml from "sanitize-html";
import { withFirebase } from "../Firebase";
import FeedSettings from "./FeedSettings";
import {
  FeedBox,
  FeedHeader,
  FeedImage,
  FeedTitle,
  FeedWrapper,
  FeedList,
  FeedItem,
  ExternalLink,
  ItemTitle,
  Snippet,
  Error,
  ReloadButton,
  ReloadIcon,
  SettingsButton,
  SettingsIcon
} from "./styles";

class Feed extends Component {
  constructor(props) {
    super(props);
    const { feed } = this.props;

    this.state = {
      caching: false,
      feed,
      isSettingsActive: false
    };
  }

  componentDidMount() {
    this.checkCache();
  }

  checkCache() {
    const { feed, firebase } = this.props;
    const { caching } = this.state;

    if (!feed || caching) return;
    const maxCacheMinutes = 15;
    const date1 = dayjs(feed.cachedAt ? feed.cachedAt.toDate() : "");
    const date2 = dayjs(firebase.getTimestamp().toDate());

    if (
      !feed.cache ||
      feed.cache.error ||
      date2.diff(date1, "minute") > maxCacheMinutes
    ) {
      this.reloadData();
    }
  }

  reloadData(flush) {
    const { feed, parser, firebase } = this.props;
    const CORS_PROXY = "https://cors.bridged.cc/";
    const maxCachedItems = 30;

    if (!feed || !parser) return;

    this.setState({ caching: true }, () => {
      // CORS_PROXY + feed.url, "http://localhost:3000/feed.xml"
      parser.parseURL(CORS_PROXY + feed.url, (err, feedData) => {
        let filteredData = feedData;
        const failedData = {
          title: feed.url,
          error: String(err)
        };

        if (!flush && feedData && feed.cache && feedData.items && !feed.cache.error) {
          if (
            feed.cache.items.length + feedData.items.length <=
            maxCachedItems
          ) {
            filteredData.items = uniqBy(
              feedData.items.concat(feed.cache.items),
              "link"
            );
          } else {
            const itemsToSlice = maxCachedItems - feedData.items.length;
            filteredData.items = uniqBy(
              feedData.items.concat(
                feed.cache.items.slice(0, itemsToSlice + 1)
              ),
              "link"
            );
          }
        }

        const newFeed = {
          ...feed,
          cache: err ? failedData : filteredData,
          cachedAt: firebase.getTimestamp().toDate()
        };

        firebase
          .feed(feed.uid)
          .update(newFeed)
          .then(() => {
            this.setState({
              feed: newFeed,
              caching: false
            });
            console.log(
              `Cached: ${feedData ? feedData.title : failedData.title}`
            );
          })
          .catch(error => {
            this.setState({
              feed: null,
              caching: false
            });
            console.log(`Error caching ${failedData.title}: ${error}`);
          });
      });
    });
  }

  render() {
    const { tab } = this.props;
    const { isSettingsActive, feed } = this.state;
    const data = feed ? feed.cache : null;

    return (
      <FeedBox>
        <FeedHeader>
          <FeedTitle>
            {data && data.image && (
              <FeedImage
                src={data.image.url}
                title={data.image.title}
              ></FeedImage>
            )}
            <a href={data && data.link}>{data && data.title}</a>
          </FeedTitle>
          <div>
            <ReloadButton onClick={() => this.reloadData(true)}>
              <ReloadIcon />
            </ReloadButton>
            <SettingsButton
              onClick={() =>
                this.setState({ isSettingsActive: !isSettingsActive })
              }
            >
              <SettingsIcon />
            </SettingsButton>
          </div>
        </FeedHeader>
        <FeedWrapper>
          {isSettingsActive && (
            <FeedSettings
              feed={feed}
              tab={tab}
              isActive={isSettingsActive}
              closeSettings={() => this.setState({ isSettingsActive: false })}
            />
          )}
          {!isSettingsActive && (
            <Fragment>
              {data && data.items && !data.error ? (
                <FeedList>
                  {data.items.map((item, index) => {
                    const snippet = sanitizeHtml(
                      item.contentSnippet || item["content:encoded"],
                      { allowedTags: [], allowedAttributes: {} }
                    ).substring(0, 100);
                    return (
                      <FeedItem key={`${item.guid || item.id}-${index}`}>
                        <ExternalLink
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`${dayjs(item.pubDate).format(
                            "DD MMM YYYY"
                          )}: ${item.title} - ${snippet}`}
                        >
                          <ItemTitle>{item.title}</ItemTitle> -{" "}
                          <Snippet
                            dangerouslySetInnerHTML={{
                              __html: snippet
                            }}
                          />
                        </ExternalLink>
                      </FeedItem>
                    );
                  })}
                </FeedList>
              ) : (
                <Error>{data && data.error}</Error>
              )}
            </Fragment>
          )}
        </FeedWrapper>
      </FeedBox>
    );
  }
}

export default withFirebase(Feed);
