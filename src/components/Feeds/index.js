import React, { Component } from "react";
import rssParser from "rss-parser";
import Feed from "./Feed";
import { PageContainer } from "../../common/common.styles";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { GridWrapper, FeedGrid } from "./styles";

class Feeds extends Component {
  constructor(props) {
    super(props);

    this.parser = new rssParser({
      defaultRSS: 2.0,
      headers: {'x-cors-grida-api-key': '551a44ac-2d84-401d-b5b1-7959479753d2'}
    });
  }

  render() {
    const { feeds, selectedTab } = this.props;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <PageContainer>
            <GridWrapper>
              {feeds && (
                <FeedGrid>
                  {feeds.map((feed, index) => (
                    <Feed
                      authUser={authUser}
                      key={`${feed.uid}-${index}`}
                      tab={selectedTab}
                      feed={feed}
                      parser={this.parser}
                    />
                  ))}
                </FeedGrid>
              )}

              {!feeds && <div>There are no feeds ...</div>}
            </GridWrapper>
          </PageContainer>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Feeds);
